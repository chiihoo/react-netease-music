import React, { useEffect, useCallback } from 'react'
import { useObserver } from 'mobx-react-lite'
import { useStores } from '@/stores'
import SearchHeader from './components/search-header'
import SearchHotDetail from './components/search-hot-detail'
import './index.scss'

const Search = props => {
  const { searchStore } = useStores()

  useEffect(() => {
    searchStore.getSearchDefault()
    searchStore.getSearchHotDetail()
  }, [searchStore])

  const getSearchResult = useCallback(keywords => {
    searchStore.getSearchResult(keywords)
    // eslint-disable-next-line
  }, [])

  const getSearchSuggest = useCallback(keywords => {
    searchStore.getSearchSuggest(keywords)
    // eslint-disable-next-line
  }, [])

  return useObserver(() => (
    <div className="search">
      <div>
        <SearchHeader
          showKeyword={searchStore.searchDefault?.showKeyword}
          realkeyword={searchStore.searchDefault?.realkeyword}
          searchSuggest={searchStore.searchSuggest}
          getSearchResult={getSearchResult}
          getSearchSuggest={getSearchSuggest}
        />
      </div>
      <SearchHotDetail searchHotDetail={searchStore.searchHotDetail} />
    </div>
  ))
}

export default React.memo(Search)
