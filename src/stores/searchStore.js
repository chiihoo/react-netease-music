import { observable, computed, action, flow } from 'mobx'
import {
  fetchSearchDefault,
  fetchSearchHotDetail,
  fetchSearchSuggest,
  fetchSearchResult
} from '@/api'

export class searchStore {
  @observable searchDefault = {}
  @observable searchHotDetail = []
  @observable searchSuggest = {}
  @observable searchResult = {}

  getSearchDefault = flow(function* () {
    const res = yield fetchSearchDefault()
    this.searchDefault = res.data
  })
  getSearchHotDetail = flow(function* () {
    const res = yield fetchSearchHotDetail()
    this.searchHotDetail = res.data
  })
  getSearchSuggest = flow(function* (keywords) {
    const res = yield fetchSearchSuggest(keywords)
    this.searchSuggest = res.result
  })
  getSearchResult = flow(function* (keywords) {
    const res = yield fetchSearchResult(keywords)
    this.searchResult = res.result
  })
}
