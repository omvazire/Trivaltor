import Visitor from '../models/Visitor.js';

export const createVisitor = async (req, res, next) => {
  try {
    const { sessionId, languageSelected, pagesVisited, categoryVisited } = req.body;
    
    // Check if visitor session already exists
    let visitor = await Visitor.findOne({ sessionId });
    
    if (visitor) {
      return res.status(200).json({
        success: true,
        data: visitor
      });
    }

    // Format initial page and category arrays if they were passed as raw strings
    const formattedPages = [];
    if (pagesVisited) {
      if (Array.isArray(pagesVisited)) {
        formattedPages.push(...pagesVisited.map(p => typeof p === 'string' ? { page: p, timestamp: new Date() } : p));
      } else if (typeof pagesVisited === 'string') {
        formattedPages.push({ page: pagesVisited, timestamp: new Date() });
      } else {
        formattedPages.push(pagesVisited);
      }
    }

    const formattedCategories = [];
    if (categoryVisited) {
      if (Array.isArray(categoryVisited)) {
        formattedCategories.push(...categoryVisited.map(c => typeof c === 'string' ? { category: c, timestamp: new Date() } : c));
      } else if (typeof categoryVisited === 'string') {
        formattedCategories.push({ category: categoryVisited, timestamp: new Date() });
      } else {
        formattedCategories.push(categoryVisited);
      }
    }

    visitor = new Visitor({
      sessionId,
      languageSelected: languageSelected || 'en',
      firstVisitTime: new Date(),
      lastVisitTime: new Date(),
      pagesVisited: formattedPages,
      categoryVisited: formattedCategories
    });

    await visitor.save();

    res.status(201).json({
      success: true,
      data: visitor
    });
  } catch (error) {
    next(error);
  }
};

export const updateVisitor = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { pagesVisited, categoryVisited, languageSelected, lastVisitTime } = req.body;

    const updateObj = {};
    const setObj = { lastVisitTime: lastVisitTime || new Date() };

    if (languageSelected) {
      setObj.languageSelected = languageSelected;
    }

    updateObj.$set = setObj;

    // Handle page push
    if (pagesVisited) {
      let pageEntry;
      if (typeof pagesVisited === 'string') {
        pageEntry = { page: pagesVisited, timestamp: new Date() };
      } else {
        pageEntry = {
          page: pagesVisited.page,
          timestamp: pagesVisited.timestamp || new Date()
        };
      }
      updateObj.$push = updateObj.$push || {};
      updateObj.$push.pagesVisited = pageEntry;
    }

    // Handle category push
    if (categoryVisited) {
      let categoryEntry;
      if (typeof categoryVisited === 'string') {
        categoryEntry = { category: categoryVisited, timestamp: new Date() };
      } else {
        categoryEntry = {
          category: categoryVisited.category,
          timestamp: categoryVisited.timestamp || new Date()
        };
      }
      updateObj.$push = updateObj.$push || {};
      updateObj.$push.categoryVisited = categoryEntry;
    }

    const visitor = await Visitor.findOneAndUpdate(
      { sessionId },
      updateObj,
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: visitor
    });
  } catch (error) {
    next(error);
  }
};
