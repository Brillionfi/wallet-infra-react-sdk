export function jwtDecode(base64Url: string) {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const base64Padded = base64 + padding;
  const binary = atob(base64Padded);
  const binaryLength = binary.length;
  const bytes = new Uint8Array(binaryLength);
  for (let i = 0; i < binaryLength; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const text = new TextDecoder().decode(bytes);
  return text;
}
