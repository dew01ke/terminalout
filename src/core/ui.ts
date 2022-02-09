import { createSettings, Settings } from '@/settings';
import { emit } from '@/core/events';

const style = `
.container {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 25px;
  background-image: url();
  background-repeat: repeat;
  overflow: hidden;
  color: #88FE87;
  text-shadow: 0 0 8px rgba(136, 254, 135, 0.95);
  box-shadow: inset 0 0 15px 13px rgba(0, 0, 0, 0.45);
  box-sizing: border-box;
  font-family: monospace;
  font-size: 16px;
  background-color: black;
}
.container:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 90%, rgba(37, 64, 45, 0.25) 100%);
  animation-duration: 3s;
  animation-name: to-crt;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  z-index: -1;
}
@keyframes to-crt {
  0% {
    transform: translateY(-100%);
  }
  100% {erf
    transform: translateY(0);
  }
}
.stdout {
  flex: 1;
  overflow: hidden;
}
.stdin {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
}
.stdin .cursor {

}
.stdin span {
  position: relative;
  margin: 0 10px 0 0;
  background-color: transparent;
  outline: 0;
  cursor: none;
  caret-color: transparent;
  user-select: none;
}
.stdin span:last-of-type:after {
  content: '';
  position: absolute;
  right: -18px;
  top: 0;
  bottom: 0;
  width: 16px;
  height: 100%;
  background-color: #88FE87;
  animation: blinker 850ms linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
`;

function injectStyle(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
}

function createUserInterface() {
  const container = document.createElement('div');
  container.classList.add('container');

  container.innerHTML = `
    <div class="stdout"></div>
    <div class="stdin">
        <span>></span>
        <span class="input" contenteditable="true"></span>
    </div>
  `;

  const stdoutElement = container.querySelector('.stdout') as HTMLElement;
  const inputElement = container.querySelector('.input') as HTMLElement;

  function scrollToBottom(): void {
    stdoutElement.scrollTo(0, stdoutElement.scrollHeight);
  }

  function scrollByLine(ratio: number): void {
    stdoutElement.scrollTop = stdoutElement.scrollTop + ratio * 30;
  }

  function clearStdout(): void {
    stdoutElement.innerHTML = '';
  }

  function addCommand(text: string, isCommand?: boolean): void {
    const line = document.createElement('div');
    line.classList.add('line');
    line.innerText = `${(isCommand ? '> ' : '')}${text}`;

    stdoutElement.appendChild(line);
  }

  container.addEventListener('click', () => {
    inputElement.focus();
  });

  inputElement.addEventListener('keydown', async (e: KeyboardEvent) => {
    const key = e.key;

    switch (key) {
      case 'Enter': {
        const value = inputElement.innerHTML.trim();

        e.preventDefault();

        if (value) {
          inputElement.innerHTML = '';
          addCommand(value, true);
          emit(value);
          scrollToBottom();
        }

        break;
      }

      case 'ArrowUp':
      case 'ArrowDown': {
        e.preventDefault();
        scrollByLine(key === 'ArrowUp' ? -1 : 1);

        break;
      }
    }
  });

  return {
    container,
    clearStdout,
    addCommand,
  };
}

export function createTerminalout(target: string | HTMLElement, settings?: Settings): void {
  let element: HTMLElement = null;

  if (!target) {
    throw new Error('Target element not specified');
  }

  if (typeof target === 'string') {
    element = document.querySelector(target);
  }

  if (!element) {
    throw new Error('Target element not found');
  }

  const config = createSettings(settings);
  const { container } = createUserInterface();

  injectStyle(style);

  element.appendChild(container);
}
