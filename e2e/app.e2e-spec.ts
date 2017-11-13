import { MachinePage } from './app.po';

describe('machine App', function() {
  let page: MachinePage;

  beforeEach(() => {
    page = new MachinePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
