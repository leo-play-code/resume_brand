import { NextRequest, NextResponse } from 'next/server';
// TODO: remove 'as any' casts once `npx prisma generate` has been re-run
// (currently blocked by EPERM — dev server holds the query engine DLL).
import { prisma } from '@/lib/prisma';
import { buildDemoHtml } from '@/lib/demo-template';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  const project = await (prisma.project.findUnique as any)({
    where: { id: projectId },
    select: { heroType: true, heroJsCode: true },
  }) as { heroType: string; heroJsCode: string | null } | null;

  if (!project || project.heroType !== 'js-demo' || !project.heroJsCode) {
    return new NextResponse('Not found', { status: 404 });
  }

  const html = buildDemoHtml(project.heroJsCode);

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    },
  });
}
