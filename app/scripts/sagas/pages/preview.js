import {put, call, select, fork, take} from 'redux-saga/effects'

import {preview} from '../../actions'
import {api} from '../../services'

export function * stat () {
  try {
    yield put(preview.requests.stat.request())

    const {routing} = yield select()
    const {name} = routing.locationBeforeTransitions.query
    const stats = yield call(api.files.stat, name)

    yield put(preview.requests.stat.success({
      name,
      stats
    }))
  } catch (err) {
    yield put(preview.requests.stat.failure(err.message))
  }
}

export function * read (name) {
  try {
    yield put(preview.requests.read.request())

    const content = yield call(api.files.read, name)

    yield put(preview.requests.read.success(content))
  } catch (err) {
    yield put(preview.requests.read.failure(err.message))
  }
}

export function * watchRead () {
  const {name} = yield take(preview.PREVIEW.READ)

  yield fork(read, name)
}

export function * load () {
  yield fork(stat)
  yield fork(watchRead)
}

export function * leave () {
  yield put(preview.clear())
}
