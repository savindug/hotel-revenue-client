import { AppBar, Container, Toolbar, Typography } from '@mui/material';

export default function Footer() {
  return (
    <div
      className="fixed-bottom"
      style={{ backgroundColor: '#516B8F', zIndex: 1 }}
    >
      <footer className="text-center text-white">
        <div
          className="text-center  p-2"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
        >
          © {new Date().getFullYear()} &nbsp;
          <a
            className="text-white"
            target="_blank"
            href="https://ratebuckets.com/"
          >
            Rate Buckets, LLC
          </a>
        </div>
      </footer>
    </div>
  );
}
