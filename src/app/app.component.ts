import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import DiffMatchPatch, { Diff }  from 'diff-match-patch';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; 
import { ViewEncapsulation } from '@angular/core';
import { FileUploadButtonComponent } from './file-upload-button/file-upload-button.component';
import { retry } from 'rxjs';


declare global {
  interface Window {
    electronAPI: {
      selectFile: () => Promise<{ path: string, content: string } | null>;
      selectFile2: () => Promise<{ path: string, content: string } | null>;
      saveFile: (filePath: string, content: string) => Promise<{ success: boolean, error?: string }>;
    };
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,FileUploadButtonComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  file1: string = '';
  file2: string = '';
  lines1: string[] = [];
  lines2: string[] = [];
  diffs1: SafeHtml[] = [];
  diffs2: SafeHtml[] = [];
  file1Lines: string[] = [];
  file2Lines: string[] = [];
  file1Metadata : {size: string; modifiedAt?: string; type?: string} | null = null;
  file2Metadata : {size: string; modifiedAt?: string; type?: string} | null = null;
  
  constructor(private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('electronAPI:', window.electronAPI);
    }
  }

  dmp = new DiffMatchPatch();

  async loadFile(side: 'left' | 'right') {
    const result = await window.electronAPI.selectFile();
    if (result) {
      const lines = result.content.split('\n');
      if (side === 'left') {
        this.file1 = result.path;
        this.lines1 = lines;
      } else {
        this.file2 = result.path;
        this.lines2 = lines;
      }
      this.computeLineDiffs();
    }
  }
  computeLineDiffs() {
    const maxLines = Math.max(this.lines1.length, this.lines2.length);
    this.diffs1 = [];
    this.diffs2 = [];

    for (let i = 0; i < maxLines; i++) {
      const line1 = this.lines1[i] || '';
      const line2 = this.lines2[i] || '';
      const diffs = this.dmp.diff_main(line1, line2);
      this.dmp.diff_cleanupSemantic(diffs);

      const lhsParts: string[] = [];
      const rhsParts: string[] = [];
      for (const [op, text] of diffs as Diff[]) {
        if (op === 0) {
          lhsParts.push(`<span class="same">${text}</span>`);
          rhsParts.push(`<span class="same">${text}</span>`);
        } else if (op === -1) {
          lhsParts.push(`<span class="removed">${text}</span>`);
        } else if (op === 1) {
          rhsParts.push(`<span class="added">${text}</span>`);
        }
    }
      const lhsHtml = lhsParts.join('');
      const rhsHtml = rhsParts.join('');

      this.diffs1.push(this.sanitizer.bypassSecurityTrustHtml(lhsHtml));
      this.diffs2.push(this.sanitizer.bypassSecurityTrustHtml(rhsHtml));
    }
  }

  getLineDiffClass(line1: string, line2: string): string {
    return line1 === line2 ? 'same' : 'diff';
  }

  getHighlightedLine(line1: string, line2: string, side: 'left' | 'right'): SafeHtml  {
  const diffs = this.dmp.diff_main(line1, line2);
  this.dmp.diff_cleanupSemantic(diffs);

  const resultParts: string[] = [];
  for (const [op, text] of diffs as Diff[]) {
    if (op === 0) {
      resultParts.push(`<span class="same">${text}</span>`);
    } else if (op === -1 && side === 'left') {
      resultParts.push(`<span class="removed">${text}</span>`);
    } else if (op === 1 && side === 'right') {
      resultParts.push(`<span class="added">${text}</span>`);
    }
    // console.log(`Operation: ${op}, Text: ${text}`);
    // console.log(`Current resultParts: ${resultParts}`);
  }

  // return resultParts.join('');
  const finalHtml = resultParts.join('');
  return this.sanitizer.bypassSecurityTrustHtml(finalHtml);
}

@ViewChild('fileInput1') fileInput1!: ElementRef<HTMLInputElement>;
@ViewChild('fileInput2') fileInput2!: ElementRef<HTMLInputElement>;
selectFile(index: number) {
  if (index === 1) {
    this.fileInput1.nativeElement.click();
  } else {
    this.fileInput2.nativeElement.click();
  }
}

  onFileSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const filePath = input.files[0].name; // You can also get `input.files[0].path` in Electron
      if (index === 1) {
        this.file1 = filePath;
      } else {
        this.file2 = filePath;
      }
    }
  }

isDiff(index: number): boolean {
  return this.lines1[index] !== this.lines2[index];
}

  copyLine(index: number, direction: 'leftToRight' | 'rightToLeft') {
    if (direction === 'leftToRight') {
      this.lines2[index] = this.lines1[index];
    } else {
      this.lines1[index] = this.lines2[index];
    } 
  }

  async saveFiles(side: 'left' | 'right') {
    const filePath = side === 'left' ? this.file1 : this.file2;
    const lines = side === 'left' ? this.lines1 : this.lines2;
    const content = lines.join('\n');

    const result = await window.electronAPI.saveFile(filePath, content);
    if (result.success) {
      alert(`File saved: ${filePath}`);
    } else {
      alert(`Error saving file: ${result.error}`);
    }
  }

  onDragOver(event: DragEvent) {
  event.preventDefault();
  (event.currentTarget as HTMLElement).classList.add('drag-over');
}

onDragLeave(event: DragEvent) {
  (event.currentTarget as HTMLElement).classList.remove('drag-over');
}

allowedExtensions =['.txt', '.java', '.py', '.csv', '.json', '.xml', '.html', '.css', '.js', '.ts', '.md'] ;

handleValidExtensions(fileName:string) : boolean{
  return this.allowedExtensions.some(ext => fileName.toLocaleLowerCase().endsWith(ext))
}
async onFileDrop(event: DragEvent, target: 'left' | 'right') {
  event.preventDefault();
  (event.currentTarget as HTMLElement).classList.remove('drag-over');

  const file = event.dataTransfer?.files?.[0];
  if (!file) return;

  if(!this.handleValidExtensions(file.name)){
    alert('❌ Unsupported file type. Please drop a supported text/code file.');
    return;
  }

  const metaData = {
    size : this.formatBytes(file.size),
    modifiedAt: file.lastModified ? new Date (file.lastModified).toLocaleString():'',
    type: file.name.split('.').pop()?.toUpperCase()?? 'UNKNOWN',
  };
  console.log(metaData)

  const content = await file.text();
  const filePath = (file as any).path;

  if (target === 'left') {
    this.file1 = filePath || file.name;
    this.lines1 = content.split(/\r?\n/);
    this.file1Metadata = metaData;
  } else {
    this.file2 = filePath || file.name;
    this.lines2 = content.split(/\r?\n/);
    this.file2Metadata = metaData;
  }
}

  private formatBytes(bytes: number){
    if(bytes === 0) return '0 B';
    const units = ['Bytes','KB', 'MB', 'GB'];
    let i= 0;
    while(bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
      }
      return `${bytes.toFixed(1)} ${units[i]}`;
  }
 
}
