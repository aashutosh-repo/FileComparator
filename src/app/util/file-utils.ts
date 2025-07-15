import { log } from "console";

export interface FileMetaData {
    size: string;
    modifiedDate: string;
    type: string;
}

export function getFileMetaData(file: File): FileMetaData{
    return{
        size: formatBytes(file.size),
        modifiedDate: file.lastModified? new Date (file.lastModified).toLocaleString(): '',
        type: getFileExtension(file.name),
    }
}

function formatBytes(bytes: number): string {
    const UNITS = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if(bytes==0) return '0 Bytes';

    const i = Math.floor(Math.log(bytes)/ Math.log(1024))
    const size = parseFloat((bytes/Math.pow(1024, i)).toFixed(2))
    return `${size} ${UNITS[i]}`;
}

function getFileExtension(fileName: string): string {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop()?.toUpperCase() ?? 'UNKNOWN' : 'UNKNOWN';
}