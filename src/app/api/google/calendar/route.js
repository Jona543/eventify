import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.provider !== 'google') {
    return new Response(JSON.stringify({ error: 'Not authorized' }), { status: 401 });
  }

  try {
    const { title, description, start, end } = await req.json();

    const checkUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(start)}&timeMax=${encodeURIComponent(end)}&q=${encodeURIComponent(title)}&singleEvents=true`;

    const checkRes = await fetch(checkUrl, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const existing = await checkRes.json();

    if (existing.items && existing.items.length > 0) {
      return new Response(JSON.stringify({ error: 'Event already exists in calendar' }), {
        status: 409,
      });
    }

    const googleRes = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: title,
          description: description,
          start: {
            dateTime: start,
            timeZone: 'UTC',
          },
          end: {
            dateTime: end,
            timeZone: 'UTC',
          },
        }),
      }
    );

    if (!googleRes.ok) {
      const errText = await googleRes.text();
      console.error('Google Calendar API error:', errText);
      return new Response(JSON.stringify({ error: 'Google API error', detail: errText }), {
        status: 500,
      });
    }

    const createdEvent = await googleRes.json();

    return new Response(JSON.stringify({ success: true, event: createdEvent }), {
      status: 200,
    });
  } catch (err) {
    console.error('Calendar error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
