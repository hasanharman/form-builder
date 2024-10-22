import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: { filename: string } },
) {
  try {
    const filename = params.filename
    // Validate filename to prevent directory traversal attacks
    if (!filename.match(/^[a-zA-Z0-9-]+$/)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    const filePath = path.join(
      process.cwd(),
      'components',
      'templates',
      `${filename}.tsx`,
    )

    const fileContents = await fs.readFile(filePath, 'utf8')
    return NextResponse.json({ content: fileContents })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 })
  }
}
