import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Tinytest.addAsync('Client - Guard - awaits guards before waitOn and action', (test, next) => {
  const rand = Random.id();
  const events = [];
  let releaseGuard;

  FlowRouter.route('/' + rand, {
    guard: async () => {
      events.push('guard:start');
      await new Promise((resolve) => {
        releaseGuard = resolve;
      });
      events.push('guard:end');
    },
    waitOn() {
      events.push('waitOn');
    },
    action() {
      events.push('action');
    }
  });

  FlowRouter.go('/' + rand);
  Meteor.setTimeout(() => {
    test.equal(events, ['guard:start']);
    releaseGuard();
    Meteor.setTimeout(() => {
      test.equal(events, ['guard:start', 'guard:end', 'waitOn', 'action']);
      next();
    }, 50);
  }, 20);
});

Tinytest.addAsync('Client - Guard - redirect skips remaining route work', (test, next) => {
  const source = Random.id();
  const target = Random.id();
  const events = [];

  FlowRouter.route('/' + source, {
    guard(_context, redirect) {
      events.push('guard');
      redirect('/' + target);
    },
    waitOn() {
      events.push('waitOn');
    },
    action() {
      events.push('source');
    }
  });
  FlowRouter.route('/' + target, {
    action() {
      events.push('target');
    }
  });

  FlowRouter.go('/' + source);
  Meteor.setTimeout(() => {
    test.equal(events, ['guard', 'target']);
    next();
  }, 50);
});

Tinytest.addAsync('Client - Guard - nested group guards run parent to child to route', (test, next) => {
  const rand = Random.id();
  const events = [];
  const parent = FlowRouter.group({
    prefix: '/' + rand,
    guard() {
      events.push('parent');
    }
  });
  const child = parent.group({
    prefix: '/child',
    guard: async () => {
      events.push('child');
    }
  });

  child.route('/route', {
    guard() {
      events.push('route');
    },
    action() {
      events.push('action');
    }
  });

  FlowRouter.go('/' + rand + '/child/route');
  Meteor.setTimeout(() => {
    test.equal(events, ['parent', 'child', 'route', 'action']);
    next();
  }, 50);
});

Tinytest.addAsync('Client - Guard - stale async guard cannot resume or redirect', (test, next) => {
  const source = Random.id();
  const target = Random.id();
  const unwanted = Random.id();
  const events = [];
  let releaseGuard;

  FlowRouter.route('/' + source, {
    async guard(_context, redirect) {
      await new Promise((resolve) => {
        releaseGuard = resolve;
      });
      redirect('/' + unwanted);
    },
    action() {
      events.push('source');
    }
  });
  FlowRouter.route('/' + target, {
    action() {
      events.push('target');
    }
  });
  FlowRouter.route('/' + unwanted, {
    action() {
      events.push('unwanted');
    }
  });

  FlowRouter.go('/' + source);
  Meteor.setTimeout(() => {
    FlowRouter.go('/' + target);
    releaseGuard();
    Meteor.setTimeout(() => {
      test.equal(events, ['target']);
      next();
    }, 50);
  }, 20);
});
