/**
 * 微信公众号 API 权限测试脚本
 * 用于检查个人订阅号是否有草稿箱 API 权限
 *
 * 使用方法：
 *   node scripts/wechat-test.js --appid YOUR_APPID --secret YOUR_SECRET
 */

async function testWechatApi(appid, secret) {
  console.log('🔍 微信公众号 API 权限测试\n');
  console.log(`AppID: ${appid.slice(0, 6)}****${appid.slice(-4)}`);
  console.log('');

  // 1. 测试获取 access_token
  console.log('【1/3】测试获取 access_token...');
  const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
  let accessToken;
  try {
    const res = await fetch(tokenUrl);
    const data = await res.json();
    if (data.errcode) {
      console.error(`❌ 失败: ${data.errcode} - ${data.errmsg}`);
      if (data.errcode === 40164) {
        console.error('💡 提示: 需要将当前 IP 加入白名单');
        console.error('   公众号后台 → 设置与开发 → 基本配置 → IP白名单');
      }
      return false;
    }
    accessToken = data.access_token;
    console.log(`✅ 成功! access_token: ${accessToken.slice(0, 20)}...\n`);
  } catch (err) {
    console.error(`❌ 网络错误: ${err.message}`);
    return false;
  }

  // 2. 测试草稿箱开关接口
  console.log('【2/3】测试草稿箱 API 权限...');
  try {
    const draftSwitchUrl = `https://api.weixin.qq.com/cgi-bin/draft/switch?access_token=${accessToken}&checkonly=1`;
    const res = await fetch(draftSwitchUrl, { method: 'POST' });
    const data = await res.json();
    if (data.errcode) {
      console.error(`❌ 无权限: ${data.errcode} - ${data.errmsg}`);
      if (data.errcode === 48001) {
        console.error('💡 提示: 你的公众号没有草稿箱 API 权限');
        console.error('   个人订阅号可能不支持此接口，建议使用备选方案：');
        console.error('   1. 使用 WeChatSync 浏览器插件');
        console.error('   2. 在博客中添加"复制到公众号"按钮');
      }
      return false;
    }
    console.log(`✅ 草稿箱权限正常! is_open: ${data.is_open}\n`);
  } catch (err) {
    console.error(`❌ 网络错误: ${err.message}`);
    return false;
  }

  // 3. 测试获取公众号信息
  console.log('【3/3】获取公众号基本信息...');
  try {
    const userInfoUrl = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${accessToken}&openid=oDefault&lang=zh_CN`;
    // 使用获取账号基本信息接口
    const accountInfoUrl = `https://api.weixin.qq.com/cgi-bin/getcallbackip?access_token=${accessToken}`;
    const res = await fetch(accountInfoUrl);
    const data = await res.json();
    if (data.errcode) {
      console.log(`⚠️  获取信息失败: ${data.errcode} - ${data.errmsg}`);
    } else {
      console.log(`✅ 微信 API 服务器 IP 列表: ${data.ip_list ? data.ip_list.join(', ') : '获取成功'}`);
    }
  } catch (err) {
    console.log(`⚠️  获取信息失败: ${err.message}`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 所有测试通过！你的公众号支持 API 发布！');
  console.log('='.repeat(50));
  console.log('\n📝 使用方法:');
  console.log('   node scripts/wechat-publish.js \\');
  console.log(`     --appid ${appid} \\`);
  console.log('     --secret YOUR_SECRET \\');
  console.log('     --file content/posts/your-article.md');
  console.log('');

  return true;
}

// CLI
const args = process.argv.slice(2);
let appid = process.env.WECHAT_APPID || '';
let secret = process.env.WECHAT_SECRET || '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--appid' && args[i + 1]) appid = args[++i];
  if (args[i] === '--secret' && args[i + 1]) secret = args[++i];
}

if (!appid || !secret) {
  console.error('❌ 用法: node scripts/wechat-test.js --appid YOUR_APPID --secret YOUR_SECRET');
  process.exit(1);
}

testWechatApi(appid, secret);
