import { Route }   from 'meteor/jessedev:flow-router-extra';
import { Meteor }  from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

Tinytest.addAsync('Client - Route - Reactivity - getParam', (test, done) => {
  const r = new Route();
  Tracker.autorun((c) => {
    const param = r.getParam('id');
    if(param) {
      test.equal(param, 'hello');
      c.stop();
      Meteor.defer(done);
    }
  });

  setTimeout(() => {
    const context = {
      params: {id: 'hello'},
      queryParams: {}
    };
    r.registerRouteChange(context);
  }, 10);
});

Tinytest.addAsync('Client - Route - Reactivity - getParam on route close', (test, done) => {
  const r = new Route();
  let closeTriggered = false;
  Tracker.autorun((c) => {
    const param = r.getParam('id');
    if(closeTriggered) {
      test.equal(param, undefined);
      c.stop();
      Meteor.defer(done);
    }
  });

  setTimeout(() => {
    closeTriggered = true;
    r.registerRouteClose();
  }, 10);
});

Tinytest.addAsync('Client - Route - Reactivity - getQueryParam', (test, done) => {
  const r = new Route();
  Tracker.autorun((c) => {
    const param = r.getQueryParam('id');
    if(param) {
      test.equal(param, 'hello');
      c.stop();
      Meteor.defer(done);
    }
  });

  setTimeout(() => {
    const context = {
      params: {},
      queryParams: {id: 'hello'}
    };
    r.registerRouteChange(context);
  }, 10);
});

Tinytest.addAsync('Client - Route - Reactivity - getQueryParam on route close', (test, done) => {
  const r = new Route();
  let closeTriggered = false;
  Tracker.autorun((c) => {
    const param = r.getQueryParam('id');
    if(closeTriggered) {
      test.equal(param, undefined);
      c.stop();
      Meteor.defer(done);
    }
  });

  setTimeout(() => {
    closeTriggered = true;
    r.registerRouteClose();
  }, 10);
});

Tinytest.addAsync('Client - Route - Reactivity - getRouteName rerun when route closed', (test, done) => {
  const r = new Route();
  r.name = 'my-route';
  let closeTriggered = false;

  Tracker.autorun((c) => {
    const name = r.getRouteName();
    test.equal(name, r.name);

    if(closeTriggered) {
      c.stop();
      Meteor.defer(done);
    }
  });

  setTimeout(() => {
    closeTriggered = true;
    r.registerRouteClose();
  }, 10);
});

Tinytest.addAsync('Client - Route - Reactivity - watchPathChange when routeChange', (test, done) => {
  const r = new Route();
  let pathChangeCounts = 0;

  const c = Tracker.autorun(() => {
    r.watchPathChange();
    pathChangeCounts++;
  });

  const context = {
    params: {},
    queryParams: {}
  };

  setTimeout(() => {
    r.registerRouteChange(context);
    setTimeout(checkAfterNormalRouteChange, 50);
  }, 10);

  function checkAfterNormalRouteChange() {
    test.equal(pathChangeCounts, 2);
    const lastRouteChange = true;
    r.registerRouteChange(context, lastRouteChange);
    setTimeout(checkAfterLastRouteChange, 10);
  }

  function checkAfterLastRouteChange() {
    test.equal(pathChangeCounts, 2);
    c.stop();
    Meteor.defer(done);
  }
});

Tinytest.addAsync('Client - Route - Reactivity - watchPathChange when routeClose', (test, done) => {
  const r = new Route();
  let pathChangeCounts = 0;

  const c = Tracker.autorun(() => {
    r.watchPathChange();
    pathChangeCounts++;
  });

  setTimeout(() => {
    r.registerRouteClose();
    setTimeout(checkAfterRouteClose, 10);
  }, 10);

  function checkAfterRouteClose() {
    test.equal(pathChangeCounts, 2);
    c.stop();
    Meteor.defer(done);
  }
});
