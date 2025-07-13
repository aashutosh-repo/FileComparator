import { Component } from '@angular/core';

@Component({
  selector: 'app-file-upload-button',
  imports: [],
  templateUrl: './file-upload-button.component.html',
  styleUrl: './file-upload-button.component.scss'
})
export class FileUploadButtonComponent {
   fileInfo?: string;

  /**
   * Called when the value of the file input changes, i.e. when a file has been
   * selected for upload.
   *
   * @param input the file input HTMLElement
   */
  onFileSelect(input: HTMLInputElement): void {

    /**
     * Format the size to a human readable string
     *
     * @param bytes
     * @returns the formatted string e.g. `105 kB` or 25.6 MB
     */
      const files = input.files;
      if (!files || files.length === 0) {
        this.fileInfo = 'No file selected.';
        return;
      }

      const file = files[0];
    function formatBytes(bytes: number): string {
      const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const factor = 1024;
      let index = 0;

      while (bytes >= factor && index < UNITS.length - 1) {
            bytes /= factor;
            index++;
      }

      return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
    }

    this.fileInfo = `${file.name} (${formatBytes(file.size)})`;
  }

}
