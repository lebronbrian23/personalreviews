const {addReviews} = require('./backend/controllers/reviewController')

test('string with a single number should result in the number itself', () => {
    expect(addReviews('1')).toBe();
});
