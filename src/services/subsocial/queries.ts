import {
  createQueryKeys,
  createSubsocialQuery,
  poolQuery,
  QueryConfig,
  SubsocialParam,
  useSubsocialQuery,
} from '@/subsocial-query'
import { PostData } from '@subsocial/api/types'
import { useRef } from 'react'
import { useSubscribeCommentIdsByPostId } from './subscription'

const getCommentKey = 'getComment'
export const getPost = poolQuery<SubsocialParam<string>, PostData>({
  multiCall: async (allParams) => {
    const [{ api }] = allParams
    const postIds = allParams.map(({ data }) => data)
    console.log('Subsocial Service: getPost: multiCall', postIds)
    const res = await api.findPublicPosts(postIds)
    console.log('Fetch result', res, postIds)
    return res
  },
  resultMapper: {
    paramToKey: (param) => param.data,
    resultToKey: (result) => result?.id ?? '',
  },
})
export const getCommentQuery = createSubsocialQuery({
  key: 'getComment',
  getData: getPost,
})

const commentIdsByPostIdKey = 'commentIdsByPostId'
export const getCommentIdsQueryKey = createQueryKeys<string>(
  commentIdsByPostIdKey
)
export function useCommentIdsByPostId(
  postId: string,
  config?: QueryConfig & { subscribe?: boolean }
) {
  const resolverRef = useRef<(ids: string[]) => void>(() => undefined)
  const promiseRef = useRef(
    new Promise<string[]>((resolve) => {
      resolverRef.current = (ids: string[]) => resolve(ids)
    })
  )
  useSubscribeCommentIdsByPostId(
    postId,
    !!config?.subscribe,
    resolverRef.current
  )
  return useSubsocialQuery(
    {
      key: commentIdsByPostIdKey,
      data: postId,
    },
    ({ api, data }) => {
      if (!config?.subscribe) {
        return api.blockchain.getReplyIdsByPostId(data)
      }
      return promiseRef.current
    },
    config
  )
}