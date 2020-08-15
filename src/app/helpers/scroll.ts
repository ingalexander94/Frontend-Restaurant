
// Pone el scroll del chat abajo para visualizar el ultimo mensaje
export const scrollDown = (selector: string)  => {
    setTimeout(() => {
        const scroll = document.querySelector(`.${selector}`);
        if (scroll !== null) scroll.scrollTop = scroll.scrollHeight;
      }, 500);
}

// Reproducir sonido cuando llegue un nuevo mensaje
export const soundChat = () => {
  const audio = new Audio("../../assets/tono.mp3");
  audio.load();
  audio.autoplay = true;
  audio.play();
}