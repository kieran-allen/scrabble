import { Title } from "@solidjs/meta";
import { clientOnly } from '@solidjs/start'

const Canvas = clientOnly(() => import('../components/Canvas'));

export default function Home() {
  return (
    <main>
      <Title>Scrabble</Title>
      <p>Scrabble</p>
      <div>
        <Canvas />
      </div>
    </main>
  );
}
