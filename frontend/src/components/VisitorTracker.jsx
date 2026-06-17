import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export const VisitorTracker = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const hasInitializedRef = useRef(false);
  const prevPathRef = useRef('');
  const prevLangRef = useRef('');

  // 1. Session Initialization on Mount
  useEffect(() => {
    let sessionId = sessionStorage.getItem('trivaltor-session-id');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substring(2, 11);
      sessionStorage.setItem('trivaltor-session-id', sessionId);
    }

    const initSession = async () => {
      try {
        const isInitialized = sessionStorage.getItem('trivaltor-session-initialized') === 'true';
        if (!isInitialized) {
          const isOnCategory = location.pathname.startsWith('/category/');
          const categoryId = isOnCategory ? location.pathname.split('/').pop() : null;

          await api.visitor.create({
            sessionId,
            languageSelected: language || 'en',
            pagesVisited: [location.pathname],
            categoryVisited: categoryId ? [categoryId] : []
          });

          sessionStorage.setItem('trivaltor-session-initialized', 'true');
        }
        hasInitializedRef.current = true;
        prevPathRef.current = location.pathname;
        prevLangRef.current = language;
      } catch (err) {
        console.error('[Visitor Tracker] Failed to initialize visitor session:', err);
      }
    };

    initSession();
  }, []);

  // 2. Track Page and Category Changes
  useEffect(() => {
    const isInitialized = sessionStorage.getItem('trivaltor-session-initialized') === 'true';
    if (!isInitialized || !hasInitializedRef.current) return;
    if (location.pathname === prevPathRef.current) return;

    const sessionId = sessionStorage.getItem('trivaltor-session-id');
    
    const updatePathAndCategory = async () => {
      try {
        const payload = {
          pagesVisited: { page: location.pathname, timestamp: new Date() }
        };

        if (location.pathname.startsWith('/category/')) {
          const categoryId = location.pathname.split('/').pop();
          if (categoryId) {
            payload.categoryVisited = { category: categoryId, timestamp: new Date() };
          }
        }

        await api.visitor.update(sessionId, payload);
        prevPathRef.current = location.pathname;
      } catch (err) {
        console.error('[Visitor Tracker] Failed to update visitor path:', err);
      }
    };

    updatePathAndCategory();
  }, [location.pathname]);

  // 3. Track Language Changes
  useEffect(() => {
    const isInitialized = sessionStorage.getItem('trivaltor-session-initialized') === 'true';
    if (!isInitialized || !hasInitializedRef.current) return;
    if (language === prevLangRef.current) return;

    const sessionId = sessionStorage.getItem('trivaltor-session-id');
    
    const updateLanguage = async () => {
      try {
        await api.visitor.update(sessionId, {
          languageSelected: language
        });
        prevLangRef.current = language;
      } catch (err) {
        console.error('[Visitor Tracker] Failed to update visitor language:', err);
      }
    };

    updateLanguage();
  }, [language]);

  return null;
};
