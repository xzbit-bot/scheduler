import sinon from 'sinon';
import { schedule } from '../src';
import { expect } from 'chai';

const DELAY = 5000;

describe('scheduler', () => {
  let clock: sinon.SinonFakeTimers;

  describe('index', () => {
    beforeEach(() => {
      clock = sinon.useFakeTimers(0);
    });

    afterEach(() => clock.restore());

    it('Should immediately call fn', async () => {
      const fnStub = sinon.stub().resolves();
      const onErrorStub = sinon.stub().returns(null);

      const start = schedule({
        fn: fnStub,
        delay: DELAY,
        onError: onErrorStub,
      });

      void start();

      expect(fnStub.callCount).to.equal(1);
      expect(onErrorStub.called).to.be.false;
    });

    it('Should not call fn a second time just before delay', async () => {
      const fnStub = sinon.stub().resolves();
      const onErrorStub = sinon.stub().returns(null);

      const start = schedule({
        fn: fnStub,
        delay: DELAY,
        onError: onErrorStub,
      });

      void start();

      await clock.tickAsync(DELAY - 1);

      expect(fnStub.callCount).to.equal(1);
      expect(onErrorStub.called).to.be.false;
    });

    it('Should call fn after delay', async () => {
      const fnStub = sinon.stub().resolves();
      const onErrorStub = sinon.stub().returns(null);

      const start = schedule({
        fn: fnStub,
        delay: DELAY,
        onError: onErrorStub,
      });

      void start();

      await clock.tickAsync(DELAY + 1);

      expect(fnStub.callCount).to.equal(2);
      expect(onErrorStub.called).to.be.false;
    });

    it('Should call n * fn after n * delay', async () => {
      const fnStub = sinon.stub().resolves();
      const onErrorStub = sinon.stub().returns(null);

      const start = schedule({
        fn: fnStub,
        delay: DELAY,
        onError: onErrorStub,
      });

      void start();

      await clock.tickAsync(DELAY + 1);
      await clock.tickAsync(DELAY + 1);
      await clock.tickAsync(DELAY + 1);
      await clock.tickAsync(DELAY + 1);

      expect(fnStub.callCount).to.equal(5);
      expect(onErrorStub.called).to.be.false;
    });

    it('Should immediately call onError if fn failed', async () => {
      const fnStub = sinon.stub().rejects();
      const onErrorStub = sinon.stub().returns(null);

      const start = schedule({
        fn: fnStub,
        delay: DELAY,
        onError: onErrorStub,
      });

      void start();
      await clock.tickAsync(1);

      expect(onErrorStub.callCount).to.equal(1);
      expect(fnStub.callCount).to.equal(1);
    });

    it('Should stop on failure', async () => {
      const fnStub = sinon.stub().rejects();
      const onErrorStub = sinon.stub().returns(null);

      const start = schedule({
        fn: fnStub,
        delay: DELAY,
        onError: onErrorStub,
      });

      void start();

      await clock.tickAsync(1);
      await clock.tickAsync(DELAY + 1);
      await clock.tickAsync(DELAY + 1);

      expect(onErrorStub.callCount).to.equal(1);
      expect(fnStub.callCount).to.equal(1);
    });
  });
});
