import { SSL_OP_NO_TLSv1_2 } from 'constants'
import { isSameFilePath } from '.'
import IFilePath, { makeIFilePath } from './IFilePath'

export const nodeTypes: string[] = ['text', 'video', 'pdf', 'image', 'audio', 'folder']
export type NodeType = 'text' | 'video' | 'pdf' | 'image' | 'audio' | 'folder'

export interface INode {
  type: NodeType // type of node that is created
  content: any // the content of the node
  filePath: IFilePath // unique randomly generated ID which contains the type as a prefix
  nodeId: string // unique randomly generated ID which contains the type as a prefix
  title: string // user create node title
  dateCreated?: Date // date that the node was created
  longitude?: number // location of node
  latitude?: number // location of node
  locationName?: string
  imageWidth?: number
  imageHeight?: number
  start?: number
  originalHeight?: number
  originalWidth?: number
}

export type FolderContentType = 'list' | 'grid'

export interface IFolderNode extends INode {
  viewType: FolderContentType
}

export type NodeFields = keyof INode | keyof IFolderNode

export const allNodeFields: string[] = [
  'nodeId',
  'title',
  'type',
  // 'longitude',
  // 'latitude',
  'content',
  'filePath',
  'viewType',
  'longitude',
  'latitude',
  'locationName',
  'start',
  'imageWidth',
  'imageHeight',
  'originalWidth',
  'originalHeight',
]

export function isINode(object: any): object is INode {
  const propsDefined: boolean =
    typeof (object as INode).nodeId !== 'undefined' &&
    typeof (object as INode).title !== 'undefined' &&
    typeof (object as INode).type !== 'undefined' &&
    typeof (object as INode).content !== 'undefined' &&
    // typeof (object as INode).longitude !== 'undefined' &&
    // typeof (object as INode).latitude !== 'undefined' &&
    typeof (object as INode).filePath !== 'undefined'

  const filePath: IFilePath = object.filePath
  // if both are defined
  if (filePath && propsDefined) {
    for (let i = 0; i < filePath.path.length; i++) {
      if (typeof filePath.path[i] !== 'string') {
        return false
      }
    }
    // check if all fields have the right type
    // and verify if filePath.path is properly defined
    return (
      typeof (object as INode).nodeId === 'string' &&
      typeof (object as INode).title === 'string' &&
      nodeTypes.includes((object as INode).type) &&
      typeof (object as INode).content === 'string' &&
      // typeof (object as INode).longitude === 'number' &&
      // typeof (object as INode).latitude === 'number' &&
      filePath.path.length > 0 &&
      filePath.path[filePath.path.length - 1] === (object as INode).nodeId
    )
  }
}

export function makeINode(
  nodeId: any,
  path: any,
  children?: any,
  dateCreated?: any,
  type?: any,
  title?: any,
  content?: any,
  width?: any,
  height?: any,
  oWidth?: any,
  oHeight?: any,
  longitude?: any,
  latitude?: any,
  locationName?: any
): INode {
  return {
    nodeId: nodeId,
    title: title ?? 'node' + nodeId,
    type: type ?? 'text',
    dateCreated: dateCreated,
    content: content ?? 'content' + nodeId,
    filePath: makeIFilePath(path, children),
    imageWidth: width,
    imageHeight: height,
    originalWidth: oWidth,
    originalHeight: oHeight,
    longitude: longitude,
    latitude: latitude,
    locationName: locationName ?? '',
  }
}

export function isSameNode(n1: INode, n2: INode): boolean {
  return (
    n1.nodeId === n2.nodeId &&
    n1.title === n2.title &&
    n1.type === n2.type &&
    n1.content === n2.content &&
    isSameFilePath(n1.filePath, n2.filePath)
  )
}
