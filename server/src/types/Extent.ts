import { NumberTypeAnnotation } from '@babel/types'
/**
 * Defines the extent of an anchor in a document,
 * e.g. start / end characters in a text node.
 */
export type Extent = ITextExtent | IImageExtent | IVideoExtent
/** Defines the extent of an anchor on a text node */
export interface ITextExtent {
  endCharacter: number
  startCharacter: number
  text: string
  type: 'text'
}

/** Defines the extent of an anchor on an image node */
export interface IImageExtent {
  height: number
  left: number
  top: number
  type: 'image'
  width: number
}

export interface IVideoExtent {
  height: number
  left: number
  start: number
  top: number
  type: 'video'
  width: number
}

export function makeITextExtent(
  text: string,
  startCharacter: number,
  endCharacter: number
) {
  return {
    type: 'text' as 'text',
    startCharacter: startCharacter,
    endCharacter: endCharacter,
    text: text,
  }
}

export function makeIImageExtent(
  left?: number,
  top?: number,
  width?: number,
  height?: number
) {
  return {
    type: 'image' as 'image',
    left: left ?? 0,
    top: top ?? 1,
    width: width ?? 1,
    height: height ?? 1,
  }
}

export function makeIVideoExtent(
  left?: number,
  top?: number,
  width?: number,
  height?: number,
  start?: number
) {
  return {
    type: 'video' as 'video',
    left: left ?? 0,
    top: top ?? 1,
    width: width ?? 1,
    height: height ?? 1,
    start: start ?? 0,
  }
}

export function isExtent(object: any): boolean {
  return (
    object === null ||
    isITextExtent(object) ||
    isIImageExtent(object) ||
    isIVideoExtent(object)
  )
}

export function isITextExtent(object: any): boolean {
  const startCharacter = (object as ITextExtent).startCharacter
  const endCharacter = (object as ITextExtent).endCharacter
  const text = (object as ITextExtent).text
  const correctTypes =
    (object as ITextExtent).type === 'text' &&
    typeof text === 'string' &&
    typeof startCharacter === 'number' &&
    typeof endCharacter === 'number'
  if (correctTypes) {
    // check that start and end character numbers are correct
    if (startCharacter > endCharacter) {
      return false
    }
    // check that start and end character numbers match with text length
    // if (endCharacter - startCharacter !== text.length) {
    //   return false
    // }
  }
  return true
}

export function isIImageExtent(object: any): boolean {
  return (
    (object as IImageExtent).type === 'image' &&
    typeof (object as IImageExtent).left === 'number' &&
    typeof (object as IImageExtent).top === 'number' &&
    typeof (object as IImageExtent).width === 'number' &&
    typeof (object as IImageExtent).height === 'number'
  )
}

export function isIVideoExtent(object: any): boolean {
  return (
    (object as IVideoExtent).type === 'video' &&
    typeof (object as IVideoExtent).left === 'number' &&
    typeof (object as IVideoExtent).top === 'number' &&
    typeof (object as IVideoExtent).width === 'number' &&
    typeof (object as IVideoExtent).height === 'number' &&
    typeof (object as IVideoExtent).start === 'number'
  )
}

export function isSameExtent(e1: Extent | null, e2: Extent | null): boolean {
  if (e1 == null && e2 == null) {
    return true
  }
  return JSON.stringify(e1) === JSON.stringify(e2)
}
