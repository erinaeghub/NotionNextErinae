import Live2D from '@/components/Live2D'
import dynamic from 'next/dynamic'
import { AnalyticsCard } from './AnalyticsCard'
import Card from './Card'
import Catalog from './Catalog'
import { InfoCard } from './InfoCard'
import LatestPostsGroupMini from './LatestPostsGroupMini'
import TagGroups from './TagGroups'
import TouchMeCard from './TouchMeCard'

const FaceBookPage = dynamic(
  () => {
    let facebook = <></>
    try {
      facebook = import('@/components/FacebookPage')
    } catch (err) {
      console.error(err)
    }
    return facebook
  },
  { ssr: false }
)

/**
 * Hexo主题右侧栏
 * @param {*} props
 * @returns
 */
export default function SideRight(props) {
  const { post, lock, tagOptions, currentTag, rightAreaSlot, contentHeight } =
    props

  // 保留全部标签（不再按数量硬性砍掉），交给下面的高度限制去处理"太长"的问题——
  // 这样不会因为猜错数量而丢标签，超出部分统一变成可滚动查看
  const sortedTags = tagOptions?.slice(0, 60) || []

  // 让右侧栏整体（目录/交流群/最新文章/标签云/统计）不超过左侧内容区的真实高度，
  // 内容少的页面（比如只有几篇文章的分页）右侧栏会跟着变矮，不再显得又长又空；
  // 260px 是下限，避免内容极少时右侧栏被压缩到不成样子。
  // contentHeight 在客户端测量完成前是 null，此时不加限制，保持原有效果，避免首屏闪烁。
  const sideStackStyle = contentHeight
    ? { maxHeight: `${Math.max(contentHeight, 260)}px`, overflowY: 'auto' }
    : {}

  return (
    <div id='sideRight' className='hidden xl:block w-72 space-y-4 h-full'>
      <InfoCard {...props} className='w-72 wow fadeInUp' />

      <div className='sticky top-20 space-y-4' style={sideStackStyle}>
        {/* 文章页显示目录（上锁文章不显示） */}
        {!lock && post && post.toc && post.toc.length > 0 && (
          <Card className='bg-white dark:bg-[#1e1e1e] wow fadeInUp'>
            <Catalog toc={post.toc} />
          </Card>
        )}

        {/* 联系交流群 */}
        <div className='wow fadeInUp'>
          <TouchMeCard />
        </div>

        {/* 最新文章列表 */}
        <div
          className={
            'border wow fadeInUp  hover:border-indigo-600  dark:hover:border-yellow-600 duration-200 dark:border-gray-700 dark:bg-[#1e1e1e] dark:text-white rounded-xl lg:p-6 p-4 hidden lg:block bg-white'
          }>
          <LatestPostsGroupMini {...props} />
        </div>

        {rightAreaSlot}

        <FaceBookPage />
        <Live2D />

        {/* 标签和成绩 */}
        <Card
          className={
            'bg-white dark:bg-[#1e1e1e] dark:text-white hover:border-indigo-600  dark:hover:border-yellow-600 duration-200'
          }>
          <TagGroups tags={sortedTags} currentTag={currentTag} />
          <hr className='mx-1 flex border-dashed relative my-4' />
          <AnalyticsCard {...props} />
        </Card>
      </div>
    </div>
  )
}
