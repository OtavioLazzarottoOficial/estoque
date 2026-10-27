# Análise e Melhorias Necessárias - Projeto Estoque

Data: 24/10/2026  
Projeto: API REST de Controle de Estoque (NestJS + Prisma + PostgreSQL)

## Índice

- [Resumo Executivo](#resumo-executivo)
- [Correções Já Aplicadas](#correções-já-aplicadas)
- [Melhorias Necessárias](#melhorias-necessárias)
  - [1. Segurança (Crítico)](#1-segurança-crítico)
  - [2. Domínio e Entidades (Crítico)](#2-domínio-e-entidades-crítico)
  - [3. Casos de Uso e Repositórios (Alto)](#3-casos-de-uso-e-repositórios-alto)
  - [4. Infraestrutura e HTTP (Alto)](#4-infraestrutura-e-http-alto)
  - [5. Banco de Dados e Prisma (Alto)](#5-banco-de-dados-e-prisma-alto)
  - [6. Arquitetura e Organização (Médio)](#6-arquitetura-e-organização-médio)
  - [7. Tratamento de Erros (Médio)](#7-tratamento-de-erros-médio)
  - [8. Testes (Médio)](#8-testes-médio)
  - [9. Qualidade de Código e Limpeza (Baixo)](#9-qualidade-de-código-e-limpeza-baixo)
- [Plano de Implementação por Prioridade](#plano-de-implementação-por-prioridade)
- [Checklist de Validação](#checklist-de-validação)

## Resumo Executivo

O projeto apresenta uma boa arquitetura seguindo princípios DDD/Clean Architecture com NestJS, Prisma 7 e TypeScript. As principais melhorias estão relacionadas à segurança, atomicidade de operações críticas (movimentação de estoque), padronização de erros HTTP e organização modular.

## Correções Já Aplicadas

As seguintes correções foram aplicadas durante a análise:

| Arquivo | Correção | Status |
| --- | --- | --- |
| `src/domain/enterprise/entities/product.ts` | Corrigido bug em `Product.create()`: `updatedAt` agora usa `props.updatedAt ?? null` ao invés de `props.createdAt ?? null` | ✅ Aplicado |
| `src/infra/http/controllers/create-product.controller.ts` | Removido `@Public()` - rota agora protegida por autenticação JWT. Corrigido mapeamento de erro: `PriceCannotBeLessThanZeroError` agora retorna `BadRequestException` (400) ao invés de `NotFoundException` (404) | ✅ Aplicado |
| `src/infra/database/prisma/repositories/prisma-products-repository.ts` | `create()` alterado de `upsert` para `prisma.product.create()`. `save()` alterado de `upsert` para `prisma.product.update()`. `findManyRecent()` alterado para ordenar por `createdAt: 'desc'` | ✅ Aplicado |
| `src/domain/application/usecases/get-stock-by-product.ts` | Corrigido typo: `GetStockByProdutUseCase` → `GetStockByProductUseCase`, tipos renomeados | ✅ Aplicado |
| `src/infra/http/controllers/get-stock-by-product.controller.ts` | Atualizado para usar `GetStockByProductUseCase` corretamente | ✅ Aplicado |
| `src/infra/http/http.module.ts` | Atualizado import e provider para `GetStockByProductUseCase` | ✅ Aplicado |
| `src/domain/application/usecases/get-stock-by-product.spec.ts` | Atualizado imports e instância para `GetStockByProductUseCase` | ✅ Aplicado |

## Melhorias Necessárias

### 1. Segurança (Crítico)

| Item | Descrição | Arquivos Afetados | Ação Sugerida |
| --- | --- | --- | --- |
| **CORS Restritivo** | Atualmente `NestFactory.create(AppModule, { cors: true })` permite qualquer origem. | `src/infra/main.ts` | Configurar CORS com lista de origens permitidas via variável de ambiente (`CORS_ORIGINS`). Exemplo: `app.enableCors({ origin: envService.get('CORS_ORIGINS').split(','), credentials: true })` |
| **Headers de Segurança** | Falta proteção contra ataques comuns (XSS, clickjacking, etc.). | `src/infra/main.ts` | Adicionar `helmet`. Instalar `@nestjs/helmet` e usar `app.use(helmet())`. |
| **Rate Limiting** | Sem proteção contra brute force em autenticação e outras rotas sensíveis. | `src/infra/app.module.ts`, novos arquivos | Adicionar `@nestjs/throttler`. Configurar `ThrottlerModule` global com limites (ex: 10 req/min para login, 100 req/min geral). Aplicar `@Throttle()` em rotas críticas. |
| **Controle de Roles/Permissões** | Após remoção do `@Public()` em criar produto, qualquer usuário autenticado pode criar produtos. Também faltam guards para outras operações sensíveis (deletar produto, movimentações). | `src/infra/auth/` (criar), `src/infra/http/controllers/*.ts` | Criar `RolesGuard`, decorator `@Roles(...Roles[])`, enum/constantes de roles. Aplicar em rotas: criação/edição/deleção de produtos/categorias apenas para `ADMIN` ou `WAREHOUSE`. |
| **Segurança de Chaves JWT** | Chaves em base64 precisam de documentação e rotação segura. | `src/infra/auth/jwt.strategy.ts`, `README.md` | Documentar processo de geração de chaves RSA 2048/4096 no README. Adicionar validação das chaves no `EnvService`. |
| **Proteção de Dados Sensíveis** | Verificar se senhas/tokens nunca são expostos em logs ou responses. | Toda a aplicação | Auditar logs, garantir que entidades não exponham `password` (usar `class-transformer` ou selecionar campos específicos). |

### 2. Domínio e Entidades (Crítico)

| Item | Descrição | Arquivos Afetados | Ação Sugerida |
| --- | --- | --- | --- |
| **Bug corrigido** | `Product.create()` tinha `updatedAt` incorreto - **JÁ CORRIGIDO**. | `src/domain/enterprise/entities/product.ts` | Manter correção. Adicionar teste para garantir comportamento correto. |
| **Validações em Stock** | Não há validações para impedir quantidades negativas no domínio. | `src/domain/enterprise/entities/stock.ts` | Adicionar validações em `Stock.create()` e métodos de incremento/decremento (já existem regras em use-cases, mas melhor ter no domínio). |
| **Validações em Category** | Falta validação de campos obrigatórios e regras de negócio. | `src/domain/enterprise/entities/category.ts` | Adicionar validações (nome não vazio, etc.). |
| **Nomenclatura de Erros** | Inconsistência: `ProductWithNameExists` não termina com "Error" enquanto outros terminam. | `src/domain/application/usecases/errors/product-with-name-exists-error.ts` | Renomear para `ProductWithNameExistsError` e atualizar todas as referências. |
| **Erros Semânticos** | Alguns erros HTTP mapeados incorretamente (já corrigido em create-product). Verificar outros controllers. | `src/infra/http/controllers/*.ts` | Revisar todos os controllers para garantir mapeamento correto entre erros de domínio e status HTTP. |

### 3. Casos de Uso e Repositórios (Alto)

| Item | Descrição | Arquivos Afetados | Ação Sugerida |
| --- | --- | --- | --- |
| **Atomicidade em Movimentações** | `increase-in-stock` e `decrease-in-stock` criam `StockMovement` e atualizam `Stock`. Se falhar no meio, pode gerar inconsistência. | `src/domain/application/usecases/increase-in-stock-usecase.ts`, `decrease-in-stock-usecase.ts`, repositórios | Usar `prisma.$transaction()` para garantir atomicidade. Criar método transacional nos repositórios ou passar transação. |
| **Repositórios com upsert corrigidos** | `create()` e `save()` corrigidos - **JÁ CORRIGIDO**. Verificar outros repositórios. | `src/infra/database/prisma/repositories/prisma-*-repository.ts` | Auditar todos os repositórios. `create()` deve usar `create()`, `save()`/`update()` deve usar `update()`. `upsert` só deve ser usado quando realmente necessário. |
| **Ordenação de Recentes corrigida** | `findManyRecent` agora ordena por `desc` - **JÁ CORRIGIDO**. Verificar outros repositórios com "recent". | `src/infra/database/prisma/repositories/prisma-*-repository.ts` | Verificar `PrismaCategoriesRepository`, `PrismaUsersRepository` se têm ordenação correta para "recentes". |
| **Paginação Fixa** | `findManyRecent` sempre busca 10 itens hardcoded. | `src/domain/application/repositories/*-repository.ts`, use-cases, controllers | Tornar `take` parametrizável via `PaginationParams` (adicionar `limit` com valor padrão). |
| **Falta de Transações em Use-Cases** | Alguns use-cases complexos não usam transações. | Use-cases com múltiplas operações | Avaliar cada caso e implementar transações onde houver múltiplas escritas. |
| **Validação de Estoque Insuficiente** | Já existe em `decrease-in-stock-usecase`, mas garantir consistência. | `src/domain/application/usecases/decrease-in-stock-usecase.ts` | Garantir que regras estão corretas e testadas. |

### 4. Infraestrutura e HTTP (Alto)

| Item | Descrição | Arquivos Afetados | Ação Sugerida |
| --- | --- | --- | --- |
| **Tratamento Global de Exceções** | Cada controller faz switch manual para mapear erros. Código repetitivo e propenso a erros. | Criar `src/infra/http/filters/all-exceptions.filter.ts`, `src/infra/main.ts` | Criar `AllExceptionsFilter` que mapeia erros de domínio (`UseCaseError`) para status HTTP corretos. Registrar globalmente com `app.useGlobalFilters()`. Remover switches dos controllers. |
| **Rotas RESTful** | Algumas rotas não seguem convenções REST (ex: `/product` vs `/products`). | `src/infra/http/controllers/*.ts` | Padronizar para plural: `/products`, `/categories`, `/users`, `/stocks`. Manter compatibilidade ou documentar breaking changes. |
| **Versionamento de API** | Sem versionamento. | `src/infra/main.ts` | Considerar prefix global: `app.setGlobalPrefix('api/v1')` ou versionamento por controller. |
| **Validação Global** | Pipes de validação são instanciados manualmente por controller. | `src/infra/main.ts` | Adicionar `ValidationPipe` global com `transform: true`, `whitelist: true`. Adaptar para trabalhar com Zod ou migrar. |
| **Tipagem do Request com Usuário** | `current-user-decorator.ts` existe, mas verificar uso e tipagem. | `src/infra/auth/current-user-decorator.ts`, controllers | Garantir tipagem forte com `UserPayload`. Adicionar `@CurrentUser() user: UserPayload` em rotas autenticadas. |
| **Falta de DTOs** | Controllers recebem tipos inferidos de Zod, mas não há DTOs explícitos. | `src/infra/http/dtos/` (criar) | Criar DTOs para requests/responses melhorando documentação e reutilização (útil para Swagger futuramente). |

### 5. Banco de Dados e Prisma (Alto)

| Item | Descrição | Arquivos Afetados | Ação Sugerida |
| --- | --- | --- | --- |
| **Migrations** | Pasta `prisma/migrations/` não foi listada. Essencial para deploy em produção. | `prisma/` | Verificar se migrations existem: `ls prisma/migrations/`. Se não existirem, criar migração inicial: `npx prisma migrate dev --name init`. Garantir que migrations estão commitadas. |
| **Arquivo prisma7.config.ts** | Presente na raiz mas sem uso aparente. | `prisma7.config.ts` | Remover se não utilizado. Verificar se há referências antes de remover. |
| **Índices no Schema** | Apenas unique constraints. Campos como `status` em Product, datas para queries, podem precisar de índices. | `prisma/schema.prisma` | Adicionar índices: `@@index([status])` em Product, `@@index([createdAt])` em tabelas com queries "recentes", `@@index([product_Id, createdAt])` em StockMovement. |
| **Nomenclatura de Colunas** | Usa snake_case (`category_Id`, `created_at`) enquanto código TS usa camelCase. Funciona com mappers, mas inconsistente. | `prisma/schema.prisma` | Considerar padronizar para camelCase no Prisma (Prisma permite `@map` mas pode simplificar removendo mapeamentos desnecessários). Avaliar impacto em migrations. |
| **Relacionamentos e Cascades** | `Stock.product` tem `onDelete: Cascade`. `StockMovement` tem cascades em product mas não em stock/user - verificar regras de negócio. | `prisma/schema.prisma` | Revisar regras de deleção. Deletar produto deve afetar stock e movimentações? Atualmente tem cascade. Garantir que faz sentido para o negócio. |
| **PrismaService** | Verificar configuração do adapter pg e conexão. | `src/infra/database/prisma/prisma.service.ts` | Garantir que está usando corretamente `@prisma/adapter-pg` com pool de conexões. Adicionar tratamento de erros de conexão. |

### 6. Arquitetura e Organização (Médio)

| Item | Descrição | Arquivos Afetados | Ação Sugerida |
| --- | --- | --- | --- |
| **HttpModule Monolítico** | Centraliza 14 controllers e 14 use-cases em um único módulo. Difícil de escalar. | `src/infra/http/http.module.ts` | Dividir em módulos por domínio: `ProductsHttpModule`, `CategoriesHttpModule`, `UsersHttpModule`, `StocksHttpModule`, `AuthHttpModule`. Cada módulo importa apenas suas dependências. |
| **Inconsistência de Nomenclatura** | Arquivos com `-usecase.ts`, `usecase.ts`, `-use-case.ts`. Imports com relativos e `@/`. | Todo `src/` | Padronizar: usar kebab-case com `-use-case.ts` para use-cases, imports sempre com `@/` (configurado no tsconfig). Rodar busca e renomear arquivos. |
| **Módulos de Teste** | `AppModuleTest.module.ts` está em `src/infra/`. | `src/infra/AppModuleTest.module.ts` | Mover para `test/` ou `test/helpers/`. Não deve ficar em código de produção. |
| **Organização de Pastas** | Estrutura DDD está boa, mas pode melhorar. | Geral | Manter estrutura atual. Considerar `src/modules/` ao invés de `src/infra/http/` para agrupar melhor. |
| **Barrel Exports** | Falta index files para facilitar imports. | Várias pastas | Adicionar `index.ts` em pastas com muitos exports (use-cases, errors, entities) para simplificar imports. |

### 7. Tratamento de Erros (Médio)

| Item | Descrição | Arquivos Afetados | Ação Sugerida |
| --- | --- | --- | --- |
| **Filtro Global de Exceções** | Não existe. Controllers fazem tratamento manual. | Criar novo arquivo | Implementar `AllExceptionsFilter` conforme item 4. Mapear: `ResourceNotFoundError` → 404, `*ExistsError` → 409, `*CannotBeLessThanZeroError`/`*PriceCannotBeLessThanZeroError` → 400, erros não mapeados → 500. |
| **Padronização de Erros de Domínio** | Alguns erros implementam `UseCaseError`, verificar todos. | `src/domain/application/usecases/errors/*.ts`, `src/domain/enterprise/entities/errors/*.ts` | Garantir que todos os erros de regra de negócio implementem `UseCaseError` (ou interface comum) para facilitar mapeamento no filtro global. |
| **Mensagens de Erro** | Algumas mensagens em inglês, consistentes. | Erros | Manter consistência. Considerar i18n futuramente se necessário. |
| **Error Classes** | `ProductWithNameExists` deve ser renomeado para `ProductWithNameExistsError` | Ver item 2 | Aplicar renomeação com busca global. |

### 8. Testes (Médio)

| Item | Descrição | Arquivos Afetados | Ação Sugerida |
| --- | --- | --- | --- |
| **Testes de Controllers** | Poucos ou nenhum teste para controllers HTTP. | `src/infra/http/controllers/*.spec.ts` (criar) | Adicionar testes unitários para controllers com mocks dos use-cases. Usar `@nestjs/testing`. |
| **Testes E2E** | Existe `vitest.config.e2e.ts` mas cobertura parece baixa. | `test/` | Criar testes e2e para fluxos principais: criar usuário, autenticar, criar produto, movimentar estoque. |
| **Cobertura de Testes** | Focar em use-cases, mas expandir. | Geral | Rodar `npm run test:cov` e identificar áreas sem cobertura. Meta sugerida: >70% para use-cases e camadas críticas. |
| **Testes de Mappers e Presenters** | Sem testes aparentes. | `src/infra/database/prisma/mappers/*.ts`, `src/infra/http/presenters/*.ts` | Adicionar testes unitários simples para garantir mapeamento correto. |
| **Testes de Entidades** | Algumas entidades têm regras (Product valida preço). | `src/domain/enterprise/entities/*.spec.ts` (criar) | Adicionar testes para `Product.create()`, `Stock`, etc. Garantir validações funcionam. |

### 9. Qualidade de Código e Limpeza (Baixo)

| Item | Descrição | Arquivos Afetados | Ação Sugerida |
| --- | --- | --- | --- |
| **Dependências Não Utilizadas** | `dayjs` instalado mas não vejo uso claro. | `package.json` | Verificar uso: `grep -rn "dayjs" src/`. Se não utilizado, remover com `npm uninstall dayjs`. |
| **Console.logs** | Commit anterior removeu, mas garantir limpeza completa. | Todo `src/` | Buscar: `grep -rn "console\." src/` e remover quaisquer logs restantes. |
| **TypeScript Strict** | Verificar se strict mode está habilitado. | `tsconfig.json` | Garantir `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`. |
| **ESLint Warnings** | Rodar lint para verificar warnings. | Todo `src/` | Executar `npm run lint` e corrigir warnings. |
| **README Desatualizado** | README é template padrão do NestJS, não descreve o projeto. | `README.md` | Atualizar com: descrição do projeto, tecnologias, como configurar .env, rodar migrations, executar testes, endpoints principais. |
| **Variáveis de Ambiente** | `.env.exemplo` existe. Verificar se está completo. | `.env.exemplo` | Garantir que todas as variáveis usadas em `env.ts` estão documentadas (DATABASE_URL, JWT_PUBLIC_KEY, JWT_PRIVATE_KEY, PORT, etc.). |
| **Comentários e Código Morto** | Verificar arquivos não utilizados. | Geral | Remover imports não usados, variáveis não utilizadas, arquivos obsoletos. |
| **Formatação** | Prettier configurado. | Geral | Rodar `npm run format` para padronizar formatação. |

## Plano de Implementação por Prioridade

### Fase 1 - Crítico (Imediato - 1-2 dias)
- [x] Corrigir bug `Product.create()` (updatedAt)
- [x] Corrigir mapeamento HTTP em `create-product.controller`
- [x] Remover `@Public()` de criar produto
- [x] Corrigir repositórios (upsert → create/update)
- [x] Corrigir ordenação "recentes" para desc
- [x] Corrigir typo `GetStockByProductUseCase`
- [ ] **Configurar CORS restritivo**
- [ ] **Adicionar Helmet**
- [ ] **Implementar Rate Limiting**
- [ ] **Garantir atomicidade em movimentações de estoque (transações)**

### Fase 2 - Alto (1-2 semanas)
- [ ] **Criar filtro global de exceções**
- [ ] **Implementar controle de roles e permissões**
- [ ] **Verificar e criar migrations do Prisma**
- [ ] **Adicionar índices ao schema Prisma**
- [ ] **Refatorar para usar transações em use-cases críticos**
- [ ] **Padronizar mapeamento de erros em todos os controllers**

### Fase 3 - Médio (2-3 semanas)
- [ ] **Dividir HttpModule em módulos por domínio**
- [ ] **Padronizar nomenclatura de arquivos e imports**
- [ ] **Criar DTOs**
- [ ] **Adicionar testes para controllers e e2e**
- [ ] **Padronizar nomenclatura de erros (ProductWithNameExistsError)**
- [ ] **Adicionar versionamento/prefixo de API**

### Fase 4 - Baixo (Contínuo)
- [ ] **Limpar dependências não utilizadas**
- [ ] **Atualizar README**
- [ ] **Melhorar cobertura de testes**
- [ ] **Adicionar testes para entidades, mappers, presenters**
- [ ] **Otimizações de performance (índices, queries)**
- [ ] **Documentação de API (Swagger)**

## Checklist de Validação

Após implementar as melhorias, validar:

### Segurança
- [ ] CORS configurado apenas para origens permitidas
- [ ] Helmet ativo
- [ ] Rate limiting funcionando em rotas sensíveis
- [ ] Rotas sensíveis protegidas por roles
- [ ] Senhas nunca expostas em responses

### Funcionalidade
- [ ] Todos os testes unitários passando (`npm run test`)
- [ ] Testes e2e passando (`npm run test:e2e`)
- [ ] Migrations aplicadas corretamente
- [ ] Movimentações de estoque atômicas (testar cenários de falha)
- [ ] Produtos criados com `updatedAt` null inicialmente

### Qualidade
- [ ] `npm run lint` sem erros
- [ ] `npm run build` compila sem erros
- [ ] Sem `console.log` no código
- [ ] Imports padronizados com `@/`
- [ ] Tratamento de erros consistente em todos os controllers
- [ ] Cobertura de testes adequada

### Banco de Dados
- [ ] Migrations commitadas em `prisma/migrations/`
- [ ] Schema validado (`npx prisma validate`)
- [ ] Cliente gerado corretamente (`npx prisma generate`)

## Observações Finais

- **Pontos Fortes**: Arquitetura DDD bem implementada, uso correto de Either, Value Objects, testes para use-cases, boa separação de responsabilidades.
- **Maior Risco**: Falta de transações em movimentações de estoque pode causar inconsistências em produção. Priorizar correção.
- **Melhor Investimento**: Implementar filtro global de exceções + controle de roles trará maior ganho em manutenibilidade e segurança.

**Recomendação Geral**: Focar nas Fases 1 e 2 primeiro, pois são críticas para segurança e integridade dos dados. As demais melhorias podem ser implementadas incrementalmente.
