import React, { useState, useEffect } from 'react'
import { ConferenceData } from '../../types/conference'
import Modal from '../../components/Modal'
import { truncateAddress } from '../../utils/address'
import dayjs from 'dayjs'
import { CURRENT_SEASON } from '../../config/config'
import useQuerySNS from '../../hooks/useQuerySNS.tsx'
import { getStatus } from '../../utils/public.ts'
import { getSeasonCandidate } from '../../api/getSeasonCandidate.ts'
import { getSeasonProposals } from '../../api/getSeasonProposals.ts'
import { getSeasonNodes } from '../../api/getSeasonNodes.ts'
import DefaultImg from '../../assets/images/defaultAvatar.png'
import { normalizeProposalUrl } from '../../utils/url.ts'
import { ChevronDown, ChevronUp } from 'lucide-react'
import styled from 'styled-components'

const Box = styled.div`
  td,
  th {
    word-break: break-all;
  }

  @media (max-width: 1024px) {
    td,
    th {
      white-space: nowrap;
    }
  }
`

export default function ArchivesPage() {
  const [data, setData] = useState<Record<number, ConferenceData>>({})
  const [selectedSeason, setSelectedSeason] = useState<number>(CURRENT_SEASON - 1)
  const [showNodesModal, setShowNodesModal] = useState(false)
  const [showCandidatesModal, setShowCandidatesModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [show, setShow] = useState(false)
  const [snsMap, setSnsMap] = useState<Record<string, string>>({})

  const { getMultiSNS } = useQuerySNS()

  const handleSNS = async (wallets: string[]) => {
    try {
      const sns_map = await getMultiSNS(wallets)
      setSnsMap(sns_map)
    } catch (error: unknown) {
      console.log(error)
    }
  }
  const loadSeasonData = async () => {
    try {
      const seasonData: Record<number, ConferenceData> = {}
      //
      // // Load all season data up to current season
      // for (let i = 1; i <= CURRENT_SEASON; i++) {
      //
      // }

      setLoading(true)
      try {
        const seasonNumber = String(selectedSeason).padStart(2, '0')

        const module =
          import.meta.env.VITE_CHAIN === 'testnet'
            ? await import(`../../data/testnet/season${seasonNumber}.json`)
            : await import(`../../data/season${seasonNumber}.json`)

        const candidates = await getSeasonCandidate(Number(seasonNumber))

        const proposals = await getSeasonProposals(Number(seasonNumber))
        const nodes = await getSeasonNodes(Number(seasonNumber))

        module.default.candidates = candidates ?? []
        module.default.proposals = proposals?.data ?? []
        module.default.nodes = nodes?.data ?? []

        const proposalArr: string[] = proposals?.data
          .filter(d => !!d.applicant)
          .map(d => d.applicant ?? '')

        console.log('nodes?.data', nodes?.data)

        const nodesArr =
          (nodes?.data as unknown as Record<string, string>[])
            .filter(d => !!d.wallet)
            .map(d => d.wallet) ?? []
        const arr: string[] = [...proposalArr, ...nodesArr, ...candidates]
        handleSNS([...new Set(arr)])

        seasonData[selectedSeason] = module.default
      } catch (error) {
        console.warn(`Season ${selectedSeason} data not available:`, error)
      }

      // Filter out seasons with no data
      const filteredData = Object.fromEntries(
        Object.entries(seasonData).filter(([_, value]) => {
          console.log(_)
          return value !== null
        })
      )

      setData(filteredData)

      // Set the initial selected season to the latest available season
      const seasons = Object.keys(filteredData).map(Number)
      if (seasons.length > 0) {
        setSelectedSeason(Math.max(...seasons))
      }
    } catch (error) {
      console.error('Error loading season data:', error)
      setError('加载数据时发生错误，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSeasonData()
    setShow(false)
  }, [selectedSeason])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            重新加载
          </button>
        </div>
      </div>
    )
  }

  const selectedSeasonData = selectedSeason ? data[selectedSeason] : null

  const handleShow = () => {
    setShow(!show)
  }

  return (
    <Box className="gap-8 flex flex-col md:flex-row ">
      {/* Left Navigation Panel */}
      <div className="w-full sticky top-24 h-fit sm:w-64  ">
        <div
          className={`bg-white rounded-lg shadow-lg p-6 flex-1 ${show ? 'overflow-auto' : 'h-[75px] overflow-hidden'}  sm:h-auto md:overflow-auto `}
        >
          <div className="text-xl font-bold mb-6 flex justify-between">
            <div>历史会议</div>
            <div className="block sm:hidden" onClick={() => handleShow()}>
              {show ? <ChevronUp /> : <ChevronDown />}
            </div>
          </div>
          <nav className="space-y-2">
            {[...Array(CURRENT_SEASON - 1)].map((_, index) => (
              <button
                key={CURRENT_SEASON - 1 - index}
                onClick={() => setSelectedSeason(CURRENT_SEASON - 1 - index)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group ${
                  selectedSeason === CURRENT_SEASON - 1 - index
                    ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700'
                    : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    selectedSeason === CURRENT_SEASON - 1 - index
                      ? 'bg-primary-500 scale-125'
                      : 'bg-gray-300 group-hover:bg-gray-400'
                  }`}
                ></span>
                第{CURRENT_SEASON - 1 - index}季
              </button>
            ))}
            {/*{Object.keys(data)*/}
            {/*  .map(Number)*/}
            {/*  .sort((a, b) => b - a) // Sort in descending order*/}
            {/*  .map((season) => (*/}
            {/*    <button*/}
            {/*      key={season}*/}
            {/*      onClick={() => setSelectedSeason(season)}*/}
            {/*      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group ${*/}
            {/*        selectedSeason === season*/}
            {/*          ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700'*/}
            {/*          : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'*/}
            {/*      }`}*/}
            {/*    >*/}
            {/*      <span className={`w-2 h-2 rounded-full transition-all duration-200 ${*/}
            {/*        selectedSeason === season */}
            {/*          ? 'bg-primary-500 scale-125' */}
            {/*          : 'bg-gray-300 group-hover:bg-gray-400'*/}
            {/*      }`}></span>*/}
            {/*      第{season}季*/}
            {/*    </button>*/}
            {/*  ))}*/}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      {selectedSeasonData && (
        <div className="flex-1 space-y-8">
          {/* Season Overview */}
          <section className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">
                第{selectedSeasonData.season}季节点共识大会
              </h1>
              <p className="text-gray-600">
                {dayjs(selectedSeasonData.startDate).format('YYYY年MM月DD日')} -{' '}
                {dayjs(selectedSeasonData.endDate).format('MM月DD日')}
              </p>
            </div>

            {/* Node Info Cards */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              {/* Current Season Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">节点信息</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">节点数量</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary-600">
                        {selectedSeasonData.nodes.length}
                      </span>
                      {selectedSeasonData.sbtToken.explorerUrl && (
                        <a
                          href={
                            selectedSeasonData.sbtToken.explorerUrl +
                            '?a=' +
                            selectedSeasonData.sbtToken.tokenId
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          合约 →
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">有效SCR要求</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary-600">
                          {selectedSeasonData.currentCriteria.validSCR}
                        </span>
                        {selectedSeasonData.currentCriteria.validSCRProposalLink && (
                          <a
                            href={normalizeProposalUrl(
                              selectedSeasonData.currentCriteria.validSCRProposalLink
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-600 hover:text-primary-700"
                          >
                            提案 →
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">活跃SCR要求</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary-600">
                          {selectedSeasonData.currentCriteria.activeSCR}
                        </span>
                        {selectedSeasonData.currentCriteria.activeSCRProposalLink && (
                          <a
                            href={normalizeProposalUrl(
                              selectedSeasonData.currentCriteria.activeSCRProposalLink
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-600 hover:text-primary-700"
                          >
                            提案 →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-gray-200">
                    <div
                      className="text-primary-600 hover:text-primary-700 cursor-pointer text-xs"
                      onClick={() => setShowNodesModal(true)}
                    >
                      查看节点列表 →
                    </div>
                    <div
                      className="text-primary-600 hover:text-primary-700 cursor-pointer text-xs"
                      onClick={() => setShowCandidatesModal(true)}
                    >
                      查看候选人名单 →
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Season Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">下季节点要求</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">有效SCR要求</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary-600">
                        {selectedSeasonData.nextSeasonCriteria.validSCR}
                      </span>
                      {selectedSeasonData.nextSeasonCriteria.validSCRProposalLink && (
                        <a
                          href={normalizeProposalUrl(
                            selectedSeasonData.nextSeasonCriteria.validSCRProposalLink
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          提案 →
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">活跃SCR要求</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary-600">
                        {selectedSeasonData.nextSeasonCriteria.activeSCR}
                      </span>
                      {selectedSeasonData.nextSeasonCriteria.activeSCRProposalLink && (
                        <a
                          href={normalizeProposalUrl(
                            selectedSeasonData.nextSeasonCriteria.activeSCRProposalLink
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          提案 →
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">要求SEED数量</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary-600">1</span>
                      {
                        <a
                          href="https://node.seedao.xyz/about/noderules"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          规则 →
                        </a>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Schedule Section */}
          <section className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
            <h2 className="text-2xl font-bold mb-6">会议日程</h2>
            <div className="space-y-6">
              {Object.entries(
                selectedSeasonData.schedule.reduce(
                  (acc, session) => {
                    const date = dayjs(session.time).format('YYYY-MM-DD')
                    if (!acc[date]) acc[date] = []
                    acc[date].push(session)
                    return acc
                  },
                  {} as Record<string, typeof selectedSeasonData.schedule>
                )
              ).map(([date, sessions]) => (
                <div key={date} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-primary-700 mb-4">
                    {dayjs(date).format('YYYY年MM月DD日')}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-[120px]">
                            时间
                          </th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-1/2">
                            主题
                          </th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                            演讲人
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {sessions.map((session, index) => {
                          return (
                            <tr key={index} className="hover:bg-white transition-colors">
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {dayjs(session.time).format('HH:mm')}
                              </td>
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                {session.topic}
                              </td>
                              <td className="py-3 px-4 text-sm text-primary-600">
                                {session.speaker}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {/* Conference Materials */}
              {Array.isArray(selectedSeasonData.recordings) &&
                selectedSeasonData.recordings.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-xl font-semibold text-primary-700 mb-4">会议资料</h3>
                    <div className="bg-gray-50 rounded-xl p-6 shadow-lg">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-[120px]">
                                类型
                              </th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                                资料
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {selectedSeasonData.recordings.map((recording, index) => (
                              <tr key={index} className="hover:bg-white transition-colors">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    {recording.type === 'video' && (
                                      <div className="flex items-center gap-2">
                                        <svg
                                          className="w-5 h-5 text-primary-600"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                        </svg>
                                        <span className="text-sm text-primary-600">视频</span>
                                      </div>
                                    )}
                                    {recording.type === 'slides' && (
                                      <div className="flex items-center gap-2">
                                        <svg
                                          className="w-5 h-5 text-secondary-600"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        <span className="text-sm text-secondary-600">幻灯片</span>
                                      </div>
                                    )}
                                    {recording.type === 'article' && (
                                      <div className="flex items-center gap-2">
                                        <svg
                                          className="w-5 h-5 text-gray-600"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        <span className="text-sm text-gray-600">文章</span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <a
                                    href={recording.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors"
                                  >
                                    {recording.name}
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </section>

          {/* Proposals Section */}
          <section className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
            <h2 className="text-2xl font-bold mb-6">提案记录</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {selectedSeasonData.proposals.map(proposal => (
                <div
                  key={proposal.link}
                  className="bg-gray-50 rounded-lg transition-all duration-200 group hover:bg-gray-100 p-3 sm:p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="tag tag-primary">{proposal.category}</span>
                    <span className="tag tag-accent">{getStatus(proposal.state!)}</span>
                  </div>
                  <h3 className="text-xl font-medium mb-4 group-hover:text-primary-600 transition-colors">
                    {proposal.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {proposal.avatar && (
                        <img
                          src={proposal.avatar}
                          className="w-10 h-10 rounded-full ring-2 ring-primary-100 group-hover:ring-primary-200 transition-colors"
                        />
                      )}
                      <div>
                        {!!proposal.applicant && (
                          <span className="text-gray-900 font-medium block">
                            {snsMap[proposal.applicant?.toLowerCase() ?? ''] ??
                              truncateAddress(proposal.applicant!)}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">提案人</span>
                      </div>
                    </div>
                    <a
                      href={normalizeProposalUrl(proposal.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary px-2 sm:px-4 "
                    >
                      查看提案
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showNodesModal} onClose={() => setShowNodesModal(false)} title="节点列表">
        <div className="space-y-4">
          {selectedSeasonData?.nodes.map((node, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={node.avatar || DefaultImg}
                  alt={snsMap[node?.wallet?.toLowerCase()] ?? truncateAddress(node?.wallet)}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:items-center ">
                  <div className="font-medium text-gray-900">
                    {' '}
                    {snsMap[node?.wallet?.toLowerCase()] ?? truncateAddress(node?.wallet)}
                  </div>
                  <div className="text-sm text-gray-500 font-mono break-all">
                    {/*{truncateAddress(node?.wallet)}*/}
                    {node?.wallet}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={showCandidatesModal}
        onClose={() => setShowCandidatesModal(false)}
        title="候选人列表"
      >
        <div className="space-y-4">
          {selectedSeasonData?.candidates.map((candidate, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors  flex flex-col sm:flex-row items-start gap-4 sm:items-center"
            >
              <div className="font-medium text-gray-900">
                {' '}
                {snsMap[candidate.toLowerCase()] ?? truncateAddress(candidate)}
              </div>
              <div className="text-sm  text-gray-500 font-mono break-all">{candidate}</div>
            </div>
          ))}
        </div>
      </Modal>
    </Box>
  )
}
