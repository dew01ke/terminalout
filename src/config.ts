export interface Config {
  styles: string;
}

const styles = `
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

let config: Config = {
  styles,
};

export function createConfig(userConfig?: Config): Config {
  return Object.assign(config, userConfig || {});
}

export default config;
