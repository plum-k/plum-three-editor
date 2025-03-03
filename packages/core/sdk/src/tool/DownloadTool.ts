let link = document.createElement('a');

export class DownloadTool {

    static save(blob: Blob, filename: string) {
        if (link.href) {
            URL.revokeObjectURL(link.href);
        }
        link.href = URL.createObjectURL(blob);
        link.download = filename || 'data.json';
        link.dispatchEvent(new MouseEvent('click'));
    }
    static saveImg(img: string, filename: string) {
        if (link.href) {
            URL.revokeObjectURL(link.href);
        }
        link.href = img
        link.download = filename || 'render.json';
        link.dispatchEvent(new MouseEvent('click'));
    }
    static saveArrayBuffer(buffer: any, filename: string) {
        DownloadTool.save(new Blob([buffer], {type: 'application/octet-stream'}), filename);
    }

    static saveString(text: string, filename: string) {
        DownloadTool.save(new Blob([text], {type: 'text/plain'}), filename);
    }
}