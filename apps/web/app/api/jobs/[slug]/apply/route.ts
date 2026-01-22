import { NextRequest, NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * POST /api/jobs/[slug]/apply
 * 
 * Handles job application submission.
 * Forwards the request to the backend API.
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    // Get form data from request
    const formData = await request.formData();

    // Extract fields
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const linkedIn = formData.get('linkedIn') as string;
    const portfolio = formData.get('portfolio') as string;
    const coverLetter = formData.get('coverLetter') as string;
    const resumeFile = formData.get('resume') as File | null;

    // Validate required fields
    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: { message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // TODO: Handle file upload to backend
    // For now, just send JSON data without file
    const applicationData = {
      fullName,
      email,
      phone,
      linkedIn: linkedIn || undefined,
      portfolio: portfolio || undefined,
      coverLetter: coverLetter || undefined,
    };

    // Forward to backend API
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    const response = await fetch(`${baseUrl}/v1/jobs/${slug}/apply?locale=${locale}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || { message: 'Failed to submit application' } },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error submitting job application:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
