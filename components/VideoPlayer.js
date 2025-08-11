export default function VideoPlayer({ src }) {
  return (
    <video src={src} controls className="w-full max-w-2xl rounded" />
  );
}
