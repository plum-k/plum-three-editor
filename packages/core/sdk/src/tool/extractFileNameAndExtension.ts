export default function extractFileNameAndExtension(file: File) {
    const filename = file.name;
    const splitArray = filename.split('.');

    const nameWithoutExtension = splitArray.slice(0, -1).join('.');
    const extension = splitArray.pop()?.toLowerCase();
    return [nameWithoutExtension, extension] as [string, string];
}