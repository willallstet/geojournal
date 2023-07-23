import { isIFilePath, allNodeFields, NodeFields, nodeTypes } from '.'

export interface INodeProperty {
  fieldName: NodeFields
  value: any
}

export function makeINodeProperty(fieldName: NodeFields, newValue: any): INodeProperty {
  return {
    fieldName: fieldName,
    value: newValue,
  }
}

export function isINodeProperty(object: any): boolean {
  const propsDefined: boolean =
    typeof (object as INodeProperty).fieldName !== 'undefined' &&
    typeof (object as INodeProperty).value !== 'undefined'
  if (propsDefined && allNodeFields.includes((object as INodeProperty).fieldName)) {
    switch ((object as INodeProperty).fieldName) {
      case 'nodeId':
        return typeof (object as INodeProperty).value === 'string'
      case 'title':
        return typeof (object as INodeProperty).value === 'string'
      case 'type':
        return nodeTypes.includes((object as INodeProperty).value)
      case 'content':
        return typeof (object as INodeProperty).value === 'string'
      case 'dateCreated':
        return typeof (object as INodeProperty).value === 'string'
      case 'filePath':
        return isIFilePath((object as INodeProperty).value)
      case 'viewType':
        return typeof (object as INodeProperty).value === 'string'
      case 'longitude':
        return typeof (object as INodeProperty).value === 'number'
      case 'latitude':
        return typeof (object as INodeProperty).value === 'number'
      case 'locationName':
        return typeof (object as INodeProperty).value === 'string'
      default:
        return true
    }
  }
}
