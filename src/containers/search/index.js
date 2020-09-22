import React, { useEffect, useCallback, useState } from 'react'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { useObserver } from 'mobx-react-lite'
import { useStores } from '@/stores'
import SearchHeader from './components/search-header'
import SearchContent from './components/search-content'
import SearchResult from './components/search-result'
import './index.scss'

const Search = props => {
  const { searchStore } = useStores()

  const [showSuggest, setShowSuggest] = useState(false) // 是否展示搜索建议
  const [searchValue, setSearchValue] = useState('')

  const history = useHistory()
  const match = useRouteMatch('/search/result')

  useEffect(() => {
    searchStore.getSearchDefault()
    searchStore.getSearchHotDetail()
  }, [searchStore])

  const goBack = useCallback(() => {
    if (match) {
      setSearchValue('')
    }
    history.goBack()
  }, [match, history])

  // 初始暂定为搜索结果页面的综合栏目
  const getSearchResult = useCallback(keyword => {
    searchStore.getComplex(keyword)
    // eslint-disable-next-line
  }, [])

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
    keywords => {
      setSearchValue(keywords)
      getSearchResult(keywords)
      setShowSuggest(false)
      addSearchHistory(keywords)
      history.push('/search/result')
    },
    [getSearchResult, addSearchHistory, history]
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
        <Switch>
          <Route exact path={`/search/result`}>
            <SearchResult columnsData={searchStore.columns} />
          </Route>
          <Route path="/search">
            <SearchContent
              searchHistory={searchStore.searchHistory}
              deleteAllSearchHistory={deleteAllSearchHistory}
              searchHotDetail={searchStore.searchHotDetail}
              goSearch={goSearch}
              setSearchValue={setSearchValue}
            />
          </Route>
        </Switch>
      </div>
    </div>
  ))
}

export default React.memo(Search)
