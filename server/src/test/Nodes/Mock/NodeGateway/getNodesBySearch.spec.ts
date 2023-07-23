import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { NodeGateway } from '../../../../nodes'
import { INode, makeINode } from '../../../../types'

describe('Unit Test: Get Roots', () => {
  let uri
  let mongoClient
  let nodeGateway
  let mongoMemoryServer

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create()
    uri = mongoMemoryServer.getUri()
    mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    nodeGateway = new NodeGateway(mongoClient)
    mongoClient.connect()
  })

  beforeEach(async () => {
    const response = await nodeGateway.deleteAll()
    expect(response.success).toBeTruthy()
  })

  afterAll(async () => {
    await mongoClient.close()
    await mongoMemoryServer.stop()
  })

  test('returns matching node in title', async () => {
    const response = await nodeGateway.deleteAll()
    expect(response.success).toBeTruthy()
    const validNode1: INode = makeINode(
      '1',
      ['1'],
      null,
      'text',
      'is SEARCH working?',
      ''
    )
    const response1 = await nodeGateway.createNode(validNode1)
    expect(response1.success).toBeTruthy()

    const getResponse = await nodeGateway.getNodesBySearch('SEARCH')
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.length).toBe(1)
    const node1 = getResponse.payload.find((node) => node.nodeId === '1')
    expect(node1.title).toBe('is SEARCH working?')
  })

  test('returns multiple (case insensitive) matching nodes for title', async () => {
    const response = await nodeGateway.deleteAll()
    expect(response.success).toBeTruthy()
    const validNode1: INode = makeINode(
      '1',
      ['1'],
      null,
      'text',
      'is SEARCH working?',
      ''
    )
    const validNode2: INode = makeINode(
      '2',
      ['2'],
      null,
      'text',
      'I hope SeArCh is working!',
      ''
    )
    const response1 = await nodeGateway.createNode(validNode1)
    expect(response1.success).toBeTruthy()
    const response2 = await nodeGateway.createNode(validNode2)
    expect(response2.success).toBeTruthy()

    const getResponse = await nodeGateway.getNodesBySearch('SEARCH')
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.length).toBe(2)
    const node1 = getResponse.payload.find((node) => node.nodeId === '1')
    const node2 = getResponse.payload.find((node) => node.nodeId === '2')
    expect(node1.title).toBe('is SEARCH working?')
    expect(node2.title).toBe('I hope SeArCh is working!')
  })

  test('returns successful empty array if no matching nodes', async () => {
    const response = await nodeGateway.deleteAll()
    expect(response.success).toBeTruthy()
    const validNode1: INode = makeINode(
      '1',
      ['1'],
      null,
      'text',
      'is SEARCH working?',
      ''
    )
    const validNode2: INode = makeINode(
      '2',
      ['2'],
      null,
      'text',
      'I hope SeArCh is working!',
      ''
    )
    const response1 = await nodeGateway.createNode(validNode1)
    expect(response1.success).toBeTruthy()
    const response2 = await nodeGateway.createNode(validNode2)
    expect(response2.success).toBeTruthy()

    const getResponse = await nodeGateway.getNodesBySearch('TABLE')
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.length).toBe(0)
  })

  test('returns matching node in content', async () => {
    const response = await nodeGateway.deleteAll()
    expect(response.success).toBeTruthy()
    const validNode1: INode = makeINode(
      '1',
      ['1'],
      null,
      'text',
      '',
      'is SEARCH working?'
    )
    const response1 = await nodeGateway.createNode(validNode1)
    expect(response1.success).toBeTruthy()

    const getResponse = await nodeGateway.getNodesBySearch('SEARCH')
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.length).toBe(1)
    const node1 = getResponse.payload.find((node) => node.nodeId === '1')
    expect(node1.content).toBe('is SEARCH working?')
  })

  test('returns multiple (case insensitive) matching nodes for content', async () => {
    const response = await nodeGateway.deleteAll()
    expect(response.success).toBeTruthy()
    const validNode1: INode = makeINode(
      '1',
      ['1'],
      null,
      'text',
      '',
      'is SEARCH working?'
    )
    const validNode2: INode = makeINode(
      '2',
      ['2'],
      null,
      'text',
      '',
      'I hope SeArCh is working!'
    )
    const response1 = await nodeGateway.createNode(validNode1)
    expect(response1.success).toBeTruthy()
    const response2 = await nodeGateway.createNode(validNode2)
    expect(response2.success).toBeTruthy()

    const getResponse = await nodeGateway.getNodesBySearch('SEARCH')
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.length).toBe(2)
    const node1 = getResponse.payload.find((node) => node.nodeId === '1')
    const node2 = getResponse.payload.find((node) => node.nodeId === '2')
    expect(node1.content).toBe('is SEARCH working?')
    expect(node2.content).toBe('I hope SeArCh is working!')
  })

  test('searches both title and content', async () => {
    const response = await nodeGateway.deleteAll()
    expect(response.success).toBeTruthy()
    const validNode1: INode = makeINode(
      '1',
      ['1'],
      null,
      'text',
      '',
      'is SEARCH working?'
    )
    const validNode2: INode = makeINode(
      '2',
      ['2'],
      null,
      'text',
      'I hope SeArCh is working!',
      ''
    )
    const response1 = await nodeGateway.createNode(validNode1)
    expect(response1.success).toBeTruthy()
    const response2 = await nodeGateway.createNode(validNode2)
    expect(response2.success).toBeTruthy()

    const getResponse = await nodeGateway.getNodesBySearch('SEARCH')
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.length).toBe(2)
    const node1 = getResponse.payload.find((node) => node.nodeId === '1')
    const node2 = getResponse.payload.find((node) => node.nodeId === '2')
    expect(node1.content).toBe('is SEARCH working?')
    expect(node2.title).toBe('I hope SeArCh is working!')
  })

  test('sorts by relevance', async () => {
    const response = await nodeGateway.deleteAll()
    expect(response.success).toBeTruthy()
    const validNode1: INode = makeINode(
      '1',
      ['1'],
      null,
      'text',
      'Not a very relevant search term for this!',
      ''
    )
    const validNode2: INode = makeINode(
      '2',
      ['2'],
      null,
      'text',
      'I hope SeArCh is working!',
      'search'
    )
    const validNode3: INode = makeINode(
      '3',
      ['3'],
      null,
      'text',
      'search search searh',
      'is SEARCH working? Search should be working. Search. Just one more search for good measure.'
    )
    const response1 = await nodeGateway.createNode(validNode1)
    expect(response1.success).toBeTruthy()
    const response2 = await nodeGateway.createNode(validNode2)
    expect(response2.success).toBeTruthy()
    const response3 = await nodeGateway.createNode(validNode3)
    expect(response3.success).toBeTruthy()

    const getResponse = await nodeGateway.getNodesBySearch('SEARCH')
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.length).toBe(3)
    expect(getResponse.payload[0].title).toBe('search search searh')
    expect(getResponse.payload[1].title).toBe('I hope SeArCh is working!')
    expect(getResponse.payload[2].title).toBe('Not a very relevant search term for this!')
  })
  test('workings on all node types', async () => {
    const response = await nodeGateway.deleteAll()
    expect(response.success).toBeTruthy()
    const validNode1: INode = makeINode(
      '1',
      ['1'],
      null,
      'text',
      'is SEARCH working?',
      ''
    )
    const validNode2: INode = makeINode(
      '2',
      ['2'],
      null,
      'image',
      'I hope SeArCh is working!',
      ''
    )
    const validNode3: INode = makeINode(
      '3',
      ['3'],
      null,
      'video',
      'search better be working',
      ''
    )
    const response1 = await nodeGateway.createNode(validNode1)
    expect(response1.success).toBeTruthy()
    const response2 = await nodeGateway.createNode(validNode2)
    expect(response2.success).toBeTruthy()
    const response3 = await nodeGateway.createNode(validNode3)
    expect(response3.success).toBeTruthy()

    const getResponse = await nodeGateway.getNodesBySearch('SEARCH')
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.length).toBe(3)
    const node1 = getResponse.payload.find((node) => node.nodeId === '1')
    const node2 = getResponse.payload.find((node) => node.nodeId === '2')
    const node3 = getResponse.payload.find((node) => node.nodeId === '3')
    expect(node1.title).toBe('is SEARCH working?')
    expect(node2.title).toBe('I hope SeArCh is working!')
    expect(node3.title).toBe('search better be working')
  })
})
