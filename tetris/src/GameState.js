const btnRestartGame = document.getElementById('btn-restart-game');
const btnStartGame = document.getElementById('btn-start-game');
const btnResumeGame = document.getElementById('btn-resume-game');

const gameState = document.querySelector('.game-state');
const gameStateContents = document.querySelectorAll('.game-state-content');

const gameStates = {
  INITIAL: 'INITIAL',
  STARTED: 'STARTED',
  PAUSED: 'PAUSED',
  OVER: 'OVER',
};

export class GameState {
  constructor({ onRestart, onStart }) {
    this.state = gameStates.STARTED;
    this.onRestart = onRestart;
    this.onStart = onStart;
    btnRestartGame.addEventListener('click', this.handleOnRestart);
    btnStartGame.addEventListener('click', this.handleOnStart);
    btnResumeGame.addEventListener('click', this.handleOnResume);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event) => {
    if (event.code === 'Escape') {
      if (this.state === gameStates.STARTED) {
        this.state = gameStates.PAUSED;
      } else if (this.state === gameStates.PAUSED) {
        this.started();
      }
    }
  };

  handleOnStart = () => {
    this.started();
    this.onStart();
  };

  handleOnRestart = () => {
    this.started();
    this.onRestart();
  };

  handleOnResume = () => {
    this.started();
  };

  over() {
    this.state = gameStates.OVER;
  }

  started() {
    this.state = gameStates.STARTED;
  }

  isPaused() {
    return this.state === gameStates.PAUSED;
  }

  render() {
    gameState.dataset.state = this.state;

    if (!document.getAnimations().length || this.state === gameStates.PAUSED) {
      for (const gameStateContent of gameStateContents) {
        if (gameStateContent.dataset.state === this.state) {
          gameStateContent.style.display = 'flex';
        } else {
          gameStateContent.style.display = 'none';
        }
      }
    }
  }
}
