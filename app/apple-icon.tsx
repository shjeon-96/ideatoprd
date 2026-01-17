import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #e07a5f 0%, #f2a285 100%)',
          borderRadius: 40,
        }}
      >
        {/* Main sparkle using CSS */}
        <div
          style={{
            position: 'relative',
            width: 100,
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Vertical bar */}
          <div
            style={{
              position: 'absolute',
              width: 16,
              height: 80,
              background: 'white',
              borderRadius: 8,
            }}
          />
          {/* Horizontal bar */}
          <div
            style={{
              position: 'absolute',
              width: 80,
              height: 16,
              background: 'white',
              borderRadius: 8,
            }}
          />
          {/* Diagonal bar 1 */}
          <div
            style={{
              position: 'absolute',
              width: 12,
              height: 56,
              background: 'white',
              borderRadius: 6,
              transform: 'rotate(45deg)',
            }}
          />
          {/* Diagonal bar 2 */}
          <div
            style={{
              position: 'absolute',
              width: 12,
              height: 56,
              background: 'white',
              borderRadius: 6,
              transform: 'rotate(-45deg)',
            }}
          />
        </div>
        {/* Small sparkle top right */}
        <div
          style={{
            position: 'absolute',
            top: 30,
            right: 35,
            width: 12,
            height: 12,
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '50%',
          }}
        />
        {/* Small sparkle bottom left */}
        <div
          style={{
            position: 'absolute',
            bottom: 35,
            left: 30,
            width: 8,
            height: 8,
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '50%',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
