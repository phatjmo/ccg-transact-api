async function generateKey() {
  const { nanoid } = await import('nanoid');
  const key = nanoid(32);
  console.log(key);
}

generateKey();