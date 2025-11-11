'use client';
import Counter from '@/components/counter/Counter';
import Button from '@/components/ui/button/Button';

export default function Demo() {

  const handleClick = () => {
    alert('Clicked!');
    console.log("button clicked");
  }

  return (
    <>
      <Button label="Click me" onClick={handleClick} />
      <Counter />
    </>
  );
}

