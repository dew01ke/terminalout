import { createConfig, Config } from '@/config';
import { emit } from '@/core/events';

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

export function createTerminalout(target: string | HTMLElement, userConfig?: Config): void {
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

  const config = createConfig(userConfig);
  const { container } = createUserInterface();

  injectStyle(config.styles);

  element.appendChild(container);
}
