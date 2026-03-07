import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const exhibitions = [
  {
    name: "汉诺威工业博览会 (Hannover Messe)",
    description: "全球领先的工业技术展会，展示工业自动化、能源、物流等领域最新技术",
    location: "汉诺威",
    country: "德国",
    startDate: new Date("2026-04-20"),
    endDate: new Date("2026-04-24"),
    website: "https://www.hannovermesse.de",
    keywords: JSON.stringify(["Hannover Messe", "工业4.0", "工业自动化", "智能制造"])
  },
  {
    name: "中国国际工业博览会 (CIIF)",
    description: "中国最具影响力的工业展会之一，展示数控机床、工业自动化、机器人等技术",
    location: "上海",
    country: "中国",
    startDate: new Date("2026-09-15"),
    endDate: new Date("2026-09-19"),
    website: "https://www.ciif-expo.com",
    keywords: JSON.stringify(["CIIF", "工业博览会", "智能制造", "数控机床"])
  },
  {
    name: "美国制造业周 (IMTS)",
    description: "北美最大的制造技术展会，涵盖机床、工具、自动化等",
    location: "芝加哥",
    country: "美国",
    startDate: new Date("2026-09-14"),
    endDate: new Date("2026-09-19"),
    website: "https://www.imts.com",
    keywords: JSON.stringify(["IMTS", "制造业", "机床", "工业技术"])
  },
  {
    name: "日本国际机床展 (JIMTOF)",
    description: "亚洲领先的机床和制造技术展会",
    location: "东京",
    country: "日本",
    startDate: new Date("2026-11-01"),
    endDate: new Date("2026-11-08"),
    website: "https://www.jimtof.org",
    keywords: JSON.stringify(["JIMTOF", "机床", "制造技术", "工业设备"])
  },
  {
    name: "德国纽伦堡工业自动化展 (SPS)",
    description: "欧洲领先的工业自动化展会，展示智能生产解决方案",
    location: "纽伦堡",
    country: "德国",
    startDate: new Date("2026-11-08"),
    endDate: new Date("2026-11-10"),
    website: "https://www.mesago.de/en/sps",
    keywords: JSON.stringify(["SPS", "工业自动化", "智能生产", "驱动技术"])
  },
  {
    name: "中国国际机床展 (CIMT)",
    description: "中国最大的机床展览会，展示最新机床技术和解决方案",
    location: "北京",
    country: "中国",
    startDate: new Date("2027-04-11"),
    endDate: new Date("2027-04-16"),
    website: "http://www.cimtshow.com",
    keywords: JSON.stringify(["CIMT", "机床", "数控机床", "金属加工"])
  },
  {
    name: "欧洲机床展 (EMO)",
    description: "欧洲最大的机床展览会，每两年举办一次",
    location: "汉诺威",
    country: "德国",
    startDate: new Date("2027-09-18"),
    endDate: new Date("2027-09-23"),
    website: "https://www.emo-hannover.de",
    keywords: JSON.stringify(["EMO", "机床", "金属加工", "制造技术"])
  },
  {
    name: "中国国际机器人展览会 (CIROS)",
    description: "中国领先的机器人及智能制造展览会",
    location: "上海",
    country: "中国",
    startDate: new Date("2026-07-08"),
    endDate: new Date("2026-07-11"),
    website: "http://www.ciros.com.cn",
    keywords: JSON.stringify(["CIROS", "机器人", "智能制造", "工业自动化"])
  },
  {
    name: "美国自动化与动力传动展 (ATX)",
    description: "北美领先的自动化技术和动力传动展会",
    location: "芝加哥",
    country: "美国",
    startDate: new Date("2026-04-21"),
    endDate: new Date("2026-04-23"),
    website: "https://www.atxshow.com",
    keywords: JSON.stringify(["ATX", "自动化", "动力传动", "运动控制"])
  },
  {
    name: "德国斯图加特金属加工展 (AMB)",
    description: "国际金属加工展会，展示机床和精密工具",
    location: "斯图加特",
    country: "德国",
    startDate: new Date("2026-09-14"),
    endDate: new Date("2026-09-18"),
    website: "https://www.messe-stuttgart.de/amb",
    keywords: JSON.stringify(["AMB", "金属加工", "机床", "精密工具"])
  },
  {
    name: "印度工业博览会 (IMTEX)",
    description: "印度最大的机床和制造技术展会",
    location: "班加罗尔",
    country: "印度",
    startDate: new Date("2027-01-22"),
    endDate: new Date("2027-01-28"),
    website: "https://www.imtex.in",
    keywords: JSON.stringify(["IMTEX", "机床", "制造技术", "工业设备"])
  },
  {
    name: "意大利米兰机床展 (BI-MU)",
    description: "意大利领先的机床和机器人展览会",
    location: "米兰",
    country: "意大利",
    startDate: new Date("2026-10-04"),
    endDate: new Date("2026-10-08"),
    website: "https://www.bimu.it",
    keywords: JSON.stringify(["BI-MU", "机床", "机器人", "工业自动化"])
  },
  {
    name: "中国国际工业装配与传输技术展 (AHTE)",
    description: "中国领先的装配与传输技术展会",
    location: "上海",
    country: "中国",
    startDate: new Date("2026-09-26"),
    endDate: new Date("2026-09-28"),
    website: "http://www.ahte-expo.com",
    keywords: JSON.stringify(["AHTE", "装配技术", "传输系统", "自动化"])
  },
  {
    name: "美国包装机械展 (PACK EXPO)",
    description: "北美最大的包装机械和加工技术展会",
    location: "拉斯维加斯",
    country: "美国",
    startDate: new Date("2026-09-27"),
    endDate: new Date("2026-09-29"),
    website: "https://www.packexpolasvegas.com",
    keywords: JSON.stringify(["PACK EXPO", "包装机械", "加工技术", "自动化"])
  },
  {
    name: "德国法兰克福灯光照明展 (Light + Building)",
    description: "全球领先的灯光照明和建筑技术展会",
    location: "法兰克福",
    country: "德国",
    startDate: new Date("2026-03-08"),
    endDate: new Date("2026-03-12"),
    website: "https://light-building.messefrankfurt.com",
    keywords: JSON.stringify(["Light+Building", "照明", "建筑技术", "智能家居"])
  },
  {
    name: "韩国国际机床展 (KIMES)",
    description: "韩国领先的机床和金属加工技术展会",
    location: "首尔",
    country: "韩国",
    startDate: new Date("2027-04-13"),
    endDate: new Date("2027-04-17"),
    website: "http://www.kimes.co.kr",
    keywords: JSON.stringify(["KIMES", "机床", "金属加工", "制造技术"])
  },
  {
    name: "中国国际智能制造装备展 (CIME)",
    description: "中国领先的智能制造装备展览会",
    location: "深圳",
    country: "中国",
    startDate: new Date("2026-11-16"),
    endDate: new Date("2026-11-19"),
    website: "https://www.cime-expo.com",
    keywords: JSON.stringify(["CIME", "智能制造", "工业4.0", "装备制造"])
  },
  {
    name: "美国设计工程展 (ATX West)",
    description: "西海岸领先的自动化和动力传动技术展会",
    location: "阿纳海姆",
    country: "美国",
    startDate: new Date("2026-02-04"),
    endDate: new Date("2026-02-06"),
    website: "https://www.atxwest.com",
    keywords: JSON.stringify(["ATX West", "自动化", "设计工程", "动力传动"])
  },
  {
    name: "德国慕尼黑机器人及自动化展 (AUTOMATICA)",
    description: "全球领先的机器人及自动化技术展会",
    location: "慕尼黑",
    country: "德国",
    startDate: new Date("2027-06-27"),
    endDate: new Date("2027-06-30"),
    website: "https://www.automatica-munich.com",
    keywords: JSON.stringify(["AUTOMATICA", "机器人", "自动化", "智能制造"])
  },
  {
    name: "中国国际动力传动与控制技术展 (PTC ASIA)",
    description: "亚洲领先的动力传动与控制技术展会",
    location: "上海",
    country: "中国",
    startDate: new Date("2026-10-26"),
    endDate: new Date("2026-10-29"),
    website: "https://www.ptc-asia.com",
    keywords: JSON.stringify(["PTC ASIA", "动力传动", "液压", "气动"])
  },
  {
    name: "台湾国际工具机展 (TIMTOS)",
    description: "台湾最大的机床和工具机展览会",
    location: "台北",
    country: "台湾",
    startDate: new Date("2027-03-06"),
    endDate: new Date("2027-03-11"),
    website: "https://www.timtos.com.tw",
    keywords: JSON.stringify(["TIMTOS", "工具机", "机床", "制造技术"])
  },
  {
    name: "墨西哥工业制造展 (TECMA)",
    description: "墨西哥领先的工业制造技术展会",
    location: "蒙特雷",
    country: "墨西哥",
    startDate: new Date("2026-03-03"),
    endDate: new Date("2026-03-05"),
    website: "https://www.tecma.com.mx",
    keywords: JSON.stringify(["TECMA", "工业制造", "机床", "自动化"])
  },
  {
    name: "泰国国际机床与金属加工展 (METALEX)",
    description: "东南亚领先的机床和金属加工展会",
    location: "曼谷",
    country: "泰国",
    startDate: new Date("2026-11-18"),
    endDate: new Date("2026-11-21"),
    website: "https://www.metalex.co.th",
    keywords: JSON.stringify(["METALEX", "机床", "金属加工", "制造技术"])
  },
  {
    name: "巴西国际机床展 (FEIMAFE)",
    description: "南美最大的机床和制造技术展会",
    location: "圣保罗",
    country: "巴西",
    startDate: new Date("2027-06-07"),
    endDate: new Date("2027-06-11"),
    website: "https://www.feimafe.com.br",
    keywords: JSON.stringify(["FEIMAFE", "机床", "制造技术", "工业设备"])
  },
  {
    name: "德国杜塞尔多夫塑料橡胶展 (K SHOW)",
    description: "全球最大的塑料和橡胶工业展会",
    location: "杜塞尔多夫",
    country: "德国",
    startDate: new Date("2027-10-08"),
    endDate: new Date("2027-10-15"),
    website: "https://www.k-online.com",
    keywords: JSON.stringify(["K SHOW", "塑料", "橡胶", "工业加工"])
  },
  {
    name: "中国国际塑料橡胶工业展 (CHINAPLAS)",
    description: "亚洲最大的塑料橡胶工业展览会",
    location: "深圳",
    country: "中国",
    startDate: new Date("2026-04-13"),
    endDate: new Date("2026-04-16"),
    website: "https://www.chinaplasonline.com",
    keywords: JSON.stringify(["CHINAPLAS", "塑料", "橡胶", "工业加工"])
  },
  {
    name: "美国塑料工业展 (NPE)",
    description: "北美最大的塑料工业展会",
    location: "奥兰多",
    country: "美国",
    startDate: new Date("2027-05-06"),
    endDate: new Date("2027-05-10"),
    website: "https://www.npe.org",
    keywords: JSON.stringify(["NPE", "塑料", "工业加工", "制造技术"])
  },
  {
    name: "德国斯图加特模具展 (MOULDING EXPO)",
    description: "国际模具和工具制造技术展会",
    location: "斯图加特",
    country: "德国",
    startDate: new Date("2027-05-09"),
    endDate: new Date("2027-05-12"),
    website: "https://www.moulding-expo.de",
    keywords: JSON.stringify(["MOULDING EXPO", "模具", "工具制造", "精密加工"])
  },
  {
    name: "中国国际模具技术展 (DMC)",
    description: "中国领先的模具技术和设备展览会",
    location: "上海",
    country: "中国",
    startDate: new Date("2026-06-11"),
    endDate: new Date("2026-06-14"),
    website: "http://www.dmc-expo.com",
    keywords: JSON.stringify(["DMC", "模具", "模具技术", "制造设备"])
  },
  {
    name: "俄罗斯国际工业展 (INNOPROM)",
    description: "俄罗斯最大的工业展览会",
    location: "叶卡捷琳堡",
    country: "俄罗斯",
    startDate: new Date("2026-07-06"),
    endDate: new Date("2026-07-09"),
    website: "https://innoprom.com",
    keywords: JSON.stringify(["INNOPROM", "工业", "制造技术", "工业自动化"])
  }
]

async function main() {
  console.log('Starting seeding...')
  console.log(`Total exhibitions to create: ${exhibitions.length}`)

  for (const exhibition of exhibitions) {
    const created = await prisma.exhibition.create({
      data: exhibition
    })
    console.log(`Created exhibition: ${created.name} (${created.id})`)
  }

  console.log('\nSeeding finished successfully!')
  console.log(`Total exhibitions created: ${exhibitions.length}`)
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
