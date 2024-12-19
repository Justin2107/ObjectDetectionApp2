import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Parse search parameters
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('term');
    const index = parseInt(searchParams.get('index') || '1');

    if (!searchTerm) {
      return NextResponse.json(
        { error: 'Search term is required' },
        { status: 400 }
      );
    }

    // Construct Flickr API URL
    const flickrApiUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.FLICKR_API_KEY}&text=${encodeURIComponent(searchTerm)}&format=json&nojsoncallback=1&safe_search=1&content_type=1&media=photos&per_page=1&page=${index}`;

    // Fetch from Flickr
    const response = await fetch(flickrApiUrl);
    const data = await response.json();

    if (!data.photos?.photo?.length) {
      return NextResponse.json(
        { error: 'No images found' },
        { status: 404 }
      );
    }

    // Get photo details and construct URL
    const photo = data.photos.photo[0];
    const imageUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;

    return NextResponse.json({
      imageUrl: imageUrl,
      title: photo.title
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}