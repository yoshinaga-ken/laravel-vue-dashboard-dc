<?php

namespace App\GraphQL\Mutations\Articles;

use App\Http\Controllers\Controller;
use App\Jobs\CreateArticle;
use App\Models\Article;
use App\Traits\ArticleRequest;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

//use Webkul\Admin\Http\Controllers\Controller;
//use Webkul\Checkout\Facades\Cart;
//use Webkul\Customer\Repositories\CustomerGroupRepository;
//use Webkul\Customer\Repositories\CustomerNoteRepository;
//use Webkul\Customer\Repositories\CustomerRepository;
//use Webkul\GraphQLAPI\Validators\CustomException;
//use function Webkul\GraphQLAPI\Mutations\Admin\Customer\bagisto_graphql;

class ArticleMutation extends Controller
{
    use ArticleRequest;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(
//        protected CustomerRepository $customerRepository,
//        protected CustomerNoteRepository $customerNoteRepository,
//        protected CustomerGroupRepository $customerGroupRepository
    ) {}

    /**
     * Store a newly created resource in storage.
     *
     * @return array
     *
     * @throws \Exception
     */
    public function store(mixed $rootValue, array $input, GraphQLContext $context)
    {
        Log::debug($input);

//        return Article::find(1);

        try {
            // バリデーションの実行
            $validator = Validator::make($input, $this->rules());
            if ($validator->fails()) {
                throw new \Exception($validator->errors()->first());
            }
            
            $user = Auth::user();
            if (!$user) {
                throw new \Exception('認証されていないユーザーです');
            }

            $article = new Article();
            Gate::forUser($user)->authorize('create', $article);

            $job = new CreateArticle($input, $user);
            $articleId = Bus::dispatchNow($job);

            $article = Article::find($articleId);

            if (!$article) {
                throw new \Exception('記事の作成に失敗しました');
            }

            Log::debug('記事の作成に成功しました');

            return $article;
//            return [
//                'success' => true,
//                'message' => '記事が作成されました',
//                'article' => $article
//            ];
        } catch (\Exception $e) {
            // GraphQLのエラーとして例外をスローする
            Log::debug($e->getMessage());
            throw $e;
        }

//        bagisto_graphql()->validate($args, [
//            'first_name'        => 'string|required',
//            'last_name'         => 'string|required',
//            'gender'            => 'required',
//            'email'             => 'required|unique:customers,email',
//            'phone'             => 'unique:customers,phone',
//            'date_of_birth'     => 'string|before:today',
//            'customer_group_id' => 'required|in:'.implode(',', $this->customerGroupRepository->pluck('id')->toArray()),
//        ]);
//
//        $args['password'] = bcrypt(rand(100000, 10000000));
//
//        $args['is_verified'] = 1;
//
//        $args['date_of_birth'] = ! empty($data['date_of_birth']) ? Carbon::createFromTimeString(str_replace('/', '-', $args['date_of_birth']).'00:00:01')->format('Y-m-d') : '';
//
//        try {
//            Event::dispatch('customer.registration.before');
//
//            $customer = $this->customerRepository->create($args);
//
//            Event::dispatch('customer.registration.after', $customer);
//
//            return [
//                'success'  => true,
//                'message'  => trans('bagisto_graphql::app.admin.customers.customers.create-success'),
//                'customer' => $customer,
//            ];
//        } catch (\Exception $e) {
//            throw new CustomException($e->getMessage());
//        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @return array
     *
     * @throws CustomException
     */
    public function update(mixed $rootValue, array $args, GraphQLContext $context)
    {
//        bagisto_graphql()->validate($args, [
//            'first_name'        => 'string|required',
//            'last_name'         => 'string|required',
//            'gender'            => 'required',
//            'email'             => 'required|unique:customers,email,'.$args['id'],
//            'phone'             => 'unique:customers,phone,'.$args['id'],
//            'date_of_birth'     => 'date|before:today',
//            'customer_group_id' => 'required|in:'.implode(',', $this->customerGroupRepository->pluck('id')->toArray()),
//        ]);
//
//        $customer = $this->customerRepository->find($args['id']);
//
//        if (! $customer) {
//            throw new CustomException(trans('bagisto_graphql::app.admin.customers.customers.not-found'));
//        }
//
//        try {
//            $args['status'] = $args['status'] ?? 0;
//
//            $args['is_suspended'] = $args['is_suspended'] ?? 0;
//
//            Event::dispatch('customer.customer.update.before');
//
//            $customer = $this->customerRepository->update($args, $customer->id);
//
//            Event::dispatch('customer.customer.update.after', $customer);
//
//            return [
//                'success'  => true,
//                'message'  => trans('bagisto_graphql::app.admin.customers.customers.update-success'),
//                'customer' => $customer,
//            ];
//        } catch (\Exception $e) {
//            throw new CustomException($e->getMessage());
//        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return array
     *
     * @throws CustomException
     */
    public function delete(mixed $rootValue, array $args, GraphQLContext $context)
    {
//        $customer = $this->customerRepository->find($args['id']);
//
//        if (! $customer) {
//            throw new CustomException(trans('bagisto_graphql::app.admin.customers.customers.not-found'));
//        }
//
//        try {
//            if ($this->customerRepository->haveActiveOrders($customer)) {
//                throw new CustomException(trans('bagisto_graphql::app.admin.customers.customers.delete-order-pending'));
//            }
//
//            Event::dispatch('customer.customer.delete.before', $args['id']);
//
//            $customer->delete();
//
//            Event::dispatch('customer.customer.delete.after', $args['id']);
//
//            return [
//                'success' => true,
//                'message' => trans('bagisto_graphql::app.admin.customers.customers.delete-success'),
//            ];
//                'success' => true,
//                'message' => trans('bagisto_graphql::app.admin.customers.customers.delete-success'),
//            ];
//        } catch (\Exception $e) {
//            throw new CustomException($e->getMessage());
//        }
    }


}
