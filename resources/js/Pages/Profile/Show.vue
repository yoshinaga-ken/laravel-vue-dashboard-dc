<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import DeleteUserForm from '@/Pages/Profile/Partials/DeleteUserForm.vue';
import LogoutOtherBrowserSessionsForm from '@/Pages/Profile/Partials/LogoutOtherBrowserSessionsForm.vue';
import SectionBorder from '@/Components/SectionBorder.vue';
import TwoFactorAuthenticationForm from '@/Pages/Profile/Partials/TwoFactorAuthenticationForm.vue';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm.vue';
import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm.vue';
import UpdateProfileArticlesForm from "@/Pages/Profile/Partials/UpdateProfileArticlesForm.vue";
import ActionSection from "@/Components/ActionSection.vue";

defineProps({
    confirmsTwoFactorAuthentication: Boolean,
    sessions: Array,
});
</script>

<template>
    <AppLayout title="Profile">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                Profile
            </h2>
        </template>

        <div>
            <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                <div v-if="$page.props.jetstream.canUpdateProfileInformation">
                    <UpdateProfileInformationForm :user="$page.props.auth.user" />

                    <SectionBorder />
                </div>

                <div>
                  <ActionSection class="mt-10 sm:mt-0">
                    <template #title>
                      Followers Information
                    </template>

                    <template #description>

                    </template>

                    <template #content>
                      <div class="grid grid-cols-2">
                        <div>
                          <div>
                            <span class="font-bold">{{ $page.props.auth.user.followers.length }}</span> followers
                          </div>
                          <ul v-for="follower in $page.props.auth.user.followers" :key="follower.id">
                            <li>{{ follower.name }}</li>
                          </ul>
                        </div>
                        <div>
                          <div>
                            <span class="font-bold">{{ $page.props.auth.user.following.length }}</span> following
                          </div>
                          <ul v-for="following in $page.props.auth.user.following" :key="following.id">
                            <li>{{ following.name }}</li>
                          </ul>
                        </div>
                      </div>
                    </template>
                  </ActionSection>
                  <SectionBorder/>
                </div>

                <div v-if="$page.props.jetstream.canUpdatePassword">
                    <UpdatePasswordForm class="mt-10 sm:mt-0" />

                    <SectionBorder />
                </div>

                <div v-if="$page.props.jetstream.canManageTwoFactorAuthentication">
                    <TwoFactorAuthenticationForm
                        :requires-confirmation="confirmsTwoFactorAuthentication"
                        class="mt-10 sm:mt-0"
                    />

                    <SectionBorder />
                </div>

                <LogoutOtherBrowserSessionsForm :sessions="sessions" class="mt-10 sm:mt-0" />

                <template v-if="$page.props.jetstream.hasAccountDeletionFeatures">
                    <SectionBorder />

                    <DeleteUserForm class="mt-10 sm:mt-0" />
                </template>
            </div>
        </div>
    </AppLayout>
</template>
