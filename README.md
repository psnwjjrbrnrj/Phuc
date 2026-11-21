# 3012 Mobile IDE Workspace

Chào mừng bạn đến với **3012** — AI-Native Mobile IDE trên iOS.

## Kiến trúc thực thi nhanh
```mermaid
flowchart LR
    Editor["3012 Code Editor"] --> Live["Live Server :5500"]
    Editor --> Runner["Zero-Config Runner / SSH VPS"]
    Editor --> Agent["Coding Agent + Diff Review"]
```

- Bấm biểu tượng **Preview** trên thanh công cụ khi mở file `.md` để xem trực tiếp tài liệu và sơ đồ Mermaid.