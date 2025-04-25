const process_file = {
  name: 'process_file',
  description: 'Process a file',
  inputSchema: {
    type: 'object',
    properties: {
      projectPath: {
        type: 'string',
        description: 'this Project root path',
      },
      file: {
        type: 'string',
        description: 'File to process',
      },
      dir: {
        type: 'string',
        description: 'Directory to save the processed file',
      },
    },
    required: ['file', 'dir'],
  },
}

export { process_file }
