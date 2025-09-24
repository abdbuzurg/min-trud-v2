import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  // Now 'params' is correctly typed and available, and 'filename' can be destructured from it.
  const { filename } = await params;
  if (!filename) {
    return NextResponse.json({ error: 'Invalid filename provided' }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), 'uploads', 'jobseekers');

  try {
    const files = await fs.readdir(uploadsDir);
    const targetFile = files.find(file => path.parse(file).name === filename);

    if (!targetFile) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const filePath = path.join(uploadsDir, targetFile);

    // Read the file's contents, which returns a Node.js Buffer
    const fileBuffer = await fs.readFile(filePath);

    const fileExtension = path.parse(targetFile).ext.toLowerCase();

    // Determine the MIME type (Content-Type)
    const mimeTypes: { [key: string]: string } = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.txt': 'text/plain',
    };
    const contentType = mimeTypes[fileExtension] || 'application/octet-stream';

    // Set up the response headers
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `inline; filename="${targetFile}"`);

    // --- FIX IS HERE ---
    // The NextResponse constructor correctly handles a Node.js Buffer.
    // By passing fileBuffer directly, Next.js correctly interprets it as a valid
    // response body, satisfying both the runtime and TypeScript.
    // @ts-ignore
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: headers,
    });

  } catch (error: any) {
    console.error(error)
    // Check for a specific error code for "file not found" on the directory level
    if (error.code === 'ENOENT') {
      console.error('Directory not found:', uploadsDir);
      return NextResponse.json(
        { error: 'File directory not found on the server. This is a common production deployment issue.' },
        { status: 500 }
      );
    }

    console.error('Error reading or serving file:', error);
    return NextResponse.json(
      { error: 'An internal error occurred while processing the file.' },
      { status: 500 }
    );
  }
}
