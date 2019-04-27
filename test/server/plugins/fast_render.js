import { Meteor }         from 'meteor/meteor';
import { GetFRData }      from '../_helpers.js';
import { FastRenderColl } from '../../common/fast_render_route.js';

if (!FastRenderColl.findOne()) {
  FastRenderColl.insert({_id: 'one', aa: 10});
  FastRenderColl.insert({_id: 'two', aa: 20});
}

Meteor.publish('fast-render-data', () => {
  return FastRenderColl.find({}, {sort: {aa: -1}});
});

Meteor.publish('fast-render-data-params', function (params, queryParams) {
  this.added('fast-render-coll', 'one', { params, queryParams });
  this.ready();
});

Tinytest.add('Server - Fast Render - fast render supported route', (test) => {
  const expectedFastRenderCollData = [
    [{_id: 'two', aa: 20}, {_id: 'one', aa: 10}]
  ];

  const data = GetFRData('/the-fast-render-route');
  test.equal(data.collectionData['fast-render-coll'], expectedFastRenderCollData);
});

Tinytest.add('Server - Fast Render - fast render supported route with params', (test) => {
  const expectedFastRenderCollData = [
    [{
      _id: 'one',
      params: {id: 'the-id'},
      queryParams: {aa: '20'}
    }]
  ];

  const data = GetFRData('/the-fast-render-route-params/the-id?aa=20');
  test.equal(data.collectionData['fast-render-coll'], expectedFastRenderCollData);
});

Tinytest.add('Server - Fast Render - no fast render supported route', (test) => {
  const data = GetFRData('/no-fast-render');
  test.equal(data.collectionData, {});
});

Tinytest.add('Server - Fast Render - with group routes', (test) => {
  const expectedFastRenderCollData = [
    [{_id: 'two', aa: 20}, {_id: 'one', aa: 10}]
  ];

  const data = GetFRData('/fr/have-fr');
  test.equal(data.collectionData['fast-render-coll'], expectedFastRenderCollData);
});
