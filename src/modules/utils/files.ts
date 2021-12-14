export const isImage = (file: File) => file.type.startsWith('image/');

export const isVideo = (file: File) => file.type.startsWith('video/');

export const isAudio = (file: File) => file.type.startsWith('audio/');

export const is3D = (file: File) => file.type.startsWith('model/');

export function getFinalFileWithUpdatedName(file: File, numberOfDuplicates: number) {
  const fileNameParts = file.name.split('.');
  const extension = fileNameParts.pop();
  const finalName = fileNameParts.join('.') + '_' + numberOfDuplicates + '.' + extension;
  return new File([file], finalName, { type: file.type });
}