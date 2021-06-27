## target

- Blitz での基本技術を学ぶため、ブログを作ってみる
  - [x] 記事を投稿できる
  - [x] 記事を表示できる
  - [x] 記事一覧が表示できる
  - [x] Top ページに記事一覧が表示できる
  - [x] Top ページからログインページに飛べる
  - [x] ログインすると article/に遷移するようになる
  - [ ] 記事にコメントできる
- オブジェクト
  - ユーザー
    - 名前
    - 書いた記事
  - 記事
    - ユーザー
    - タイトル
    - 本文
  - コメント
    - 記事
    - ユーザー
    - コメント

## cording rule

## memo

- article を作成する
  - `blitz g all article title:string body:string belongsTo:user`
    - `blitz prisma format`を走らせないとフォーマットエラーが出る
    - `blitz prisma generate`を走らせないと index.d.ts が更新されない
    - mutation/郡のファイルを自分が指定した型に合わせて調整する
      - User 周りは Object を使ってがんばる
    - pages/articles/index.tsx の見出しに呼び出されている.name を適切な引数に変更する
  - フォームの作成
    - Blitz デフォルトで生成されてる LabeledTextField コンポーネントをわざわざ使う理由はなさそう
    - ~~user 周りの情報は useSession()から引っ張ってきて適切な場所に id を渡して使う~~
  - ログインしてるかどうかの判定は useSession ではなく生成されてる useCurrentUser でやる
    - 出し分けは React の基本でできる
    - ログインしてない状態で resolver.authorize()が入ってる Resource を呼び出そうとするとログインページに自動で飛ぶ
      - ただし console にエラー出るから要注意
- comment を追加
  - `blitz g resource comment name:string:default=名無しさん body:string belongsTo:article`
    - default は string に聞かないっぽい
  - belongsTo で呼び出した article との紐付けを create mutation に引数として記述する
    - type を追っていけばなんとかなる
  - カスケーディング デリートを手動で実装することを忘れない（article の delete mutation に追記）
  - `include: {Comment: true}`を get mutation に書かないと belongsTo の中身は取れない
  - 表示は標準の React の書き方でごりごり書く
  - ページ遷移をしない投稿については[useQuery の戻り地の QueryExtra](https://blitzjs.com/docs/use-query#returns)を使えば即座に最新情報を fetch できる
  - push しようとしたら mutation の方で型エラー
    - `setQueryData({...updated, Comment: article.Comment}`みたいな感じで updated に comment を付け加えてあげた

---

[![Blitz.js](https://raw.githubusercontent.com/blitz-js/art/master/github-cover-photo.png)](https://blitzjs.com)

This is a [Blitz.js](https://github.com/blitz-js/blitz) app.

# **blitz-blog-test**

## Getting Started

Setup middleware

```
docker compose up
```

Run your app in the development mode.

```
blitz dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Ensure the `.env.local` file has required environment variables:

```
DATABASE_URL=postgresql://<YOUR_DB_USERNAME>@localhost:5432/blitz-blog-test
```

Ensure the `.env.test.local` file has required environment variables:

```
DATABASE_URL=postgresql://<YOUR_DB_USERNAME>@localhost:5432/blitz-blog-test_test
```

## Tests

Runs your tests using Jest.

```
yarn test
```

Blitz comes with a test setup using [Jest](https://jestjs.io/) and [react-testing-library](https://testing-library.com/).

## Commands

Blitz comes with a powerful CLI that is designed to make development easy and fast. You can install it with `npm i -g blitz`

```
  blitz [COMMAND]

  dev       Start a development server
  build     Create a production build
  start     Start a production server
  export    Export your Blitz app as a static application
  prisma    Run prisma commands
  generate  Generate new files for your Blitz project
  console   Run the Blitz console REPL
  install   Install a recipe
  help      Display help for blitz
  test      Run project tests
```

You can read more about it on the [CLI Overview](https://blitzjs.com/docs/cli-overview) documentation.

## What's included?

Here is the starting structure of your app.

```
blitz-blog-test
├── app/
│   ├── api/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── mutations/
│   │   │   ├── changePassword.ts
│   │   │   ├── forgotPassword.test.ts
│   │   │   ├── forgotPassword.ts
│   │   │   ├── login.ts
│   │   │   ├── logout.ts
│   │   │   ├── resetPassword.test.ts
│   │   │   ├── resetPassword.ts
│   │   │   └── signup.ts
│   │   ├── pages/
│   │   │   ├── forgot-password.tsx
│   │   │   ├── login.tsx
│   │   │   ├── reset-password.tsx
│   │   │   └── signup.tsx
│   │   └── validations.ts
│   ├── core/
│   │   ├── components/
│   │   │   ├── Form.tsx
│   │   │   └── LabeledTextField.tsx
│   │   ├── hooks/
│   │   │   └── useCurrentUser.ts
│   │   └── layouts/
│   │       └── Layout.tsx
│   ├── pages/
│   │   ├── 404.tsx
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── index.test.tsx
│   │   └── index.tsx
│   └── users/
│       └── queries/
│           └── getCurrentUser.ts
├── db/
│   ├── index.ts
│   ├── schema.prisma
│   └── seeds.ts
├── integrations/
├── mailers/
│   └── forgotPasswordMailer.ts
├── public/
│   ├── favicon.ico*
│   └── logo.png
├── test/
│   ├── setup.ts
│   └── utils.tsx
├── README.md
├── babel.config.js
├── blitz.config.js
├── jest.config.js
├── package.json
├── tsconfig.json
├── types.d.ts
├── types.ts
└── yarn.lock
```

These files are:

- The `app/` folder is a container for most of your project. This is where you’ll put any pages or API routes.

- `db/` is where your database configuration goes. If you’re writing models or checking migrations, this is where to go.

- `public/` is a folder where you will put any static assets. If you have images, files, or videos which you want to use in your app, this is where to put them.

- `integrations/` is a folder to put all third-party integrations like with Stripe, Sentry, etc.

- `test/` is a folder where you can put test utilities and integration tests.

- `package.json` contains information about your dependencies and devDependencies. If you’re using a tool like `npm` or `yarn`, you won’t have to worry about this much.

- `tsconfig.json` is our recommended setup for TypeScript.

- `.babelrc.js`, `.env`, etc. ("dotfiles") are configuration files for various bits of JavaScript tooling.

- `blitz.config.js` is for advanced custom configuration of Blitz. It extends [`next.config.js`](https://nextjs.org/docs/api-reference/next.config.js/introduction).

- `jest.config.js` contains config for Jest tests. You can [customize it if needed](https://jestjs.io/docs/en/configuration).

You can read more about it in the [File Structure](https://blitzjs.com/docs/file-structure) section of the documentation.

### Tools included

Blitz comes with a set of tools that corrects and formats your code, facilitating its future maintenance. You can modify their options and even uninstall them.

- **ESLint**: It lints your code: searches for bad practices and tell you about it. You can customize it via the `.eslintrc.js`, and you can install (or even write) plugins to have it the way you like it. It already comes with the [`blitz`](https://github.com/blitz-js/blitz/tree/canary/packages/eslint-config) config, but you can remove it safely. [Learn More](https://eslint.org).
- **Husky**: It adds [githooks](https://git-scm.com/docs/githooks), little pieces of code that get executed when certain Git events are triggerd. For example, `pre-commit` is triggered just before a commit is created. You can see the current hooks inside `.husky/`. If are having problems commiting and pushing, check out ther [troubleshooting](https://typicode.github.io/husky/#/?id=troubleshoot) guide. [Learn More](https://typicode.github.io/husky).
- **Prettier**: It formats your code to look the same everywhere. You can configure it via the `.prettierrc` file. The `.prettierignore` contains the files that should be ignored by Prettier; useful when you have large files or when you want to keep a custom formatting. [Learn More](https://prettier.io).

## Learn more

Read the [Blitz.js Documentation](https://blitzjs.com/docs/getting-started) to learn more.

The Blitz community is warm, safe, diverse, inclusive, and fun! Feel free to reach out to us in any of our communication channels.

- [Website](https://blitzjs.com/)
- [Discord](https://discord.blitzjs.com/)
- [Report an issue](https://github.com/blitz-js/blitz/issues/new/choose)
- [Forum discussions](https://github.com/blitz-js/blitz/discussions)
- [How to Contribute](https://blitzjs.com/docs/contributing)
- [Sponsor or donate](https://github.com/blitz-js/blitz#sponsors-and-donations)
