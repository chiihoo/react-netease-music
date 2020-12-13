import React, { useEffect, useCallback, useState, lazy, Suspense } from 'react'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { useObserver, Observer } from 'mobx-react-lite'
import { useStores } from '@/stores'
import SearchHeader from './components/search-header'
import './index.scss'

const Search = props => {
  const LazySearchContent = lazy(() => import('./components/search-content'))
  const LazySearchResult = lazy(() => import('../search-result'))

  const { searchStore } = useStores()

  const [showSuggest, setShowSuggest] = useState(false) // 是否展示搜索建议
  const [searchValue, setSearchValue] = useState('')

  const history = useHistory()
  const match = useRouteMatch('/search/result')

  useEffect(() => {
    searchStore.getSearchDefault()
    searchStore.getSearchHotDetail()
    // eslint-disable-next-line
  }, [])

  const goBack = useCallback(() => {
    if (match) {
      setSearchValue('')
      history.push('/search')
    } else {
      history.push('/home')
    }
    // history.goBack()
  }, [match, history])

  const getSearchSuggest = useCallback(keywords => {
    searchStore.getSearchSuggest(keywords)
    // eslint-disable-next-line
  }, [])
  const addSearchHistory = useCallback(keywords => {
    searchStore.addSearchHistory(keywords)
    // eslint-disable-next-line
  }, [])
  const deleteAllSearchHistory = useCallback(() => {
    searchStore.deleteAllSearchHistory()
    // eslint-disable-next-line
  }, [])

  const goSearch = useCallback(
    keyword => {
      setSearchValue(keyword)
      setShowSuggest(false)
      addSearchHistory(keyword)
      history.push(`/search/result/${keyword}`)
    },
    // eslint-disable-next-line
    [addSearchHistory, history]
  )

  return useObserver(() => (
    <div className="search">
      <div>
        <SearchHeader
          showKeyword={searchStore.searchDefault?.showKeyword}
          realkeyword={searchStore.searchDefault?.realkeyword}
          searchSuggest={searchStore.searchSuggest}
          getSearchSuggest={getSearchSuggest}
          showSuggest={showSuggest}
          setShowSuggest={setShowSuggest}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          goSearch={goSearch}
          goBack={goBack}
        />
      </div>
      <div className="search-main" onClick={() => setShowSuggest(false)}>
        <Suspense fallback={null}>
          <Switch>
            <Route exact path={`/search/result/:keyword`} component={LazySearchResult} />
            <Route
              exact
              path="/search"
              render={() => (
                <Observer>
                  {() => (
                    <LazySearchContent
                      searchHistory={searchStore.searchHistory}
                      deleteAllSearchHistory={deleteAllSearchHistory}
                      searchHotDetail={searchStore.searchHotDetail}
                      goSearch={goSearch}
                      setSearchValue={setSearchValue}
                    />
                  )}
                </Observer>
              )}
            ></Route>
          </Switch>
        </Suspense>
      </div>
    </div>
  ))
}

export default React.memo(Search)
