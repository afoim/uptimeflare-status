const pageConfig = {
  // Title for your status page
  title: "AcoFork UptimeFlare",
  // Links shown at the header of your status page, could set `highlight` to `true`
  links: [
    { link: 'https://github.com/afoim', label: 'GitHub' },
    { link: 'https://www.onani.cn/', label: 'Blog' },
    { link: 'mailto:mailto:sudo@onani.cn?subject=[AcoFork%20UptimeFlare]%20网站反馈', label: 'Email Me', highlight: true },
  ],
}

const workerConfig = {
  // Write KV at most every 3 minutes unless the status changed
  kvWriteCooldownMinutes: 3,
  // Enable HTTP Basic auth for status page & API by uncommenting the line below, format `<USERNAME>:<PASSWORD>`
  // passwordProtection: 'username:password',
  // Define all your monitors here
  monitors: [
    {
      id: 'blog_monitor',
      name: 'Blog',
      method: 'GET',
      target: 'https://www.onani.cn',
      tooltip: '个人博客站点监控',
      statusPageLink: 'https://www.onani.cn',
      timeout: 10000,
      headers: {
        'User-Agent': 'Uptimeflare'
      }
    },
    {
      id: 'alist_monitor',
      name: 'AList',
      method: 'GET',
      target: 'https://alist.onani.cn',
      tooltip: 'AList 文件管理系统',
      statusPageLink: 'https://alist.onani.cn',
      timeout: 10000,
      headers: {
        'User-Agent': 'Uptimeflare'
      }
    },
    // Example HTTP Monitor
    {
      // `id` should be unique, history will be kept if the `id` remains constant
      id: 'foo_monitor',
      // `name` is used at status page and callback message
      name: 'My API Monitor',
      // `method` should be a valid HTTP Method
      method: 'POST',
      // `target` is a valid URL
      target: 'https://example.com',
      // [OPTIONAL] `tooltip` is ONLY used at status page to show a tooltip
      tooltip: 'This is a tooltip for this monitor',
      // [OPTIONAL] `statusPageLink` is ONLY used for clickable link at status page
      statusPageLink: 'https://example.com',
      // [OPTIONAL] `expectedCodes` is an array of acceptable HTTP response codes, if not specified, default to 2xx
      expectedCodes: [200],
      // [OPTIONAL] `timeout` in millisecond, if not specified, default to 10000
      timeout: 10000,
      // [OPTIONAL] headers to be sent
      headers: {
        'User-Agent': 'Uptimeflare',
        Authorization: 'Bearer YOUR_TOKEN_HERE',
      },
      // [OPTIONAL] body to be sent
      body: 'Hello, world!',
      // [OPTIONAL] if specified, the response must contains the keyword to be considered as operational.
      responseKeyword: 'success',
      // [OPTIONAL] if specified, the check will run in your specified region,
      // refer to docs https://github.com/lyc8503/UptimeFlare/wiki/Geo-specific-checks-setup before setting this value
      checkLocationWorkerRoute: 'https://xxx.example.com',
    },
    // Example TCP Monitor
    {
      id: 'test_tcp_monitor',
      name: 'Example TCP Monitor',
      // `method` should be `TCP_PING` for tcp monitors
      method: 'TCP_PING',
      // `target` should be `host:port` for tcp monitors
      target: '1.2.3.4:22',
      tooltip: 'My production server SSH',
      statusPageLink: 'https://example.com',
      timeout: 5000,
    },
  ],
  notification: {
    // [Optional] apprise API server URL
    // if not specified, no notification will be sent
    appriseApiServer: "https://apprise.example.com/notify",
    // [Optional] recipient URL for apprise, refer to https://github.com/caronc/apprise
    // if not specified, no notification will be sent
    recipientUrl: "tgram://bottoken/ChatID",
    // [Optional] timezone used in notification messages, default to "Etc/GMT"
    timeZone: "Asia/Shanghai",
    // [Optional] grace period in minutes before sending a notification
    // notification will be sent only if the monitor is down for N continuous checks after the initial failure
    // if not specified, notification will be sent immediately
    gracePeriod: 5,
  },
  callbacks: {
    onStatusChange: async (
      env: any,
      monitor: any,
      isUp: boolean,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.RESEND_API_KEY}` // 替换为您的Resend API密钥
        },
        body: JSON.stringify({
          from: 'UptimeFlare <uptimeflare@resend.dev>', // 替换为您的发件人
          to: 'sudo@onani.cn', // 替换为您的接收邮箱
          subject: `[UptimeFlare] ${monitor.name} 状态变更: ${isUp ? '恢复正常' : '服务中断'}`,
          html: `
            <h3>${monitor.name} 状态更新</h3>
            <p>状态: ${isUp ? '🟢 正常' : '🔴 中断'}</p>
            <p>原因: ${reason}</p>
            <p>时间: ${new Date(timeNow).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
          `
        })
      });

      console.log('发送通知邮件:', await response.text());
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // This callback will be called EVERY 1 MINTUE if there's an on-going incident for any monitor
      // Write any Typescript code here
    },
  },
}

// Don't forget this, otherwise compilation fails.
export { pageConfig, workerConfig }
