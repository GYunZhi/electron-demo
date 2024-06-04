import { Menu } from 'electron';

// 禁用默认菜单
// Menu.setApplicationMenu(null);

/**
 * 设置自定义菜单
 */
function setCustomMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建',
          accelerator: 'Ctrl+N',
        },
        {
          label: '打开',
          accelerator: 'Ctrl+O',
        },
      ],
    },
    {
      label: '编辑',
      submenu: [
        {
          label: '复制',
          accelerator: 'Ctrl+C',
        },
        {
          label: '粘贴',
          accelerator: 'Ctrl+V',
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
