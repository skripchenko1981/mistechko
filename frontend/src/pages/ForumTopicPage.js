import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, Loader2, MessageCircle, MessageSquare, Pin } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { SectionTitle } from '../components/common';
import { useAuthStore } from '../stores';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

export function ForumTopicPage() {
  const { topicId } = useParams();
  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await fetch(`${API_URL}/api/forum/topics/${topicId}`);
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Тему не знайдено.' : 'Не вдалося завантажити тему.');
        }
        const topicData = await response.json();
        setTopic(topicData);

        const repliesResponse = await fetch(`${API_URL}/api/forum/topics/${topicId}/replies`);
        if (repliesResponse.ok) setReplies(await repliesResponse.json());
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopic();
  }, [topicId]);

  const handleReply = async (event) => {
    event.preventDefault();
    setReplyError('');
    if (!replyText.trim()) {
      setReplyError('Введіть текст відповіді.');
      return;
    }

    setIsReplying(true);
    try {
      const response = await fetch(`${API_URL}/api/forum/topics/${topicId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ content: replyText.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || 'Не вдалося додати відповідь.');

      setReplies((currentReplies) => [...currentReplies, data]);
      setTopic((currentTopic) => ({
        ...currentTopic,
        replies: (currentTopic.replies || 0) + 1,
        last_reply: data.created_at,
      }));
      setReplyText('');
    } catch (replyRequestError) {
      setReplyError(replyRequestError.message);
    } finally {
      setIsReplying(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <Link to="/forum">
          <Button variant="ghost" className="mb-6 pl-0 text-[#1e3a5f] hover:bg-transparent hover:text-[#e67e22]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            До форуму
          </Button>
        </Link>

        {isLoading ? (
          <div className="h-64 animate-pulse rounded-xl bg-white" />
        ) : error ? (
          <Card>
            <CardContent className="py-16 text-center">
              <MessageSquare className="mx-auto mb-4 h-14 w-14 text-gray-300" />
              <p className="text-lg text-gray-600">{error}</p>
              <Link to="/forum" className="mt-5 inline-block">
                <Button className="bg-[#1e3a5f]">Повернутися до форуму</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <SectionTitle title={topic.title} subtitle="Обговорення громади" />
            <Card className="mt-8 border-[#d9e2ec] shadow-sm">
              <CardContent className="p-6 md:p-8">
                <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-gray-100 pb-5">
                  <Badge variant="secondary">{topic.category}</Badge>
                  {topic.is_pinned && (
                    <Badge className="bg-[#e67e22] text-white">
                      <Pin className="mr-1 h-3 w-3" />
                      Закріплено
                    </Badge>
                  )}
                  <span className="text-sm text-gray-500">Автор: {topic.author}</span>
                  <span className="text-sm text-gray-400">{formatDate(topic.created_at)}</span>
                </div>
                <p className="whitespace-pre-wrap text-base leading-7 text-gray-700">{topic.content}</p>
                <div className="mt-8 flex gap-5 border-t border-gray-100 pt-5 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {topic.replies} відповідей</span>
                  <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {topic.views} переглядів</span>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold text-[#1e3a5f]">
                Обговорення ({replies.length})
              </h2>
              {replies.length > 0 ? (
                <div className="space-y-4">
                  {replies.map((reply) => (
                    <Card key={reply.id} className="border-[#d9e2ec]">
                      <CardContent className="p-5">
                        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                          <span className="font-semibold text-[#1e3a5f]">{reply.author}</span>
                          <span className="text-gray-400">{formatDate(reply.created_at)}</span>
                        </div>
                        <p className="whitespace-pre-wrap leading-7 text-gray-700">{reply.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed border-gray-300">
                  <CardContent className="py-8 text-center text-gray-500">
                    Поки що немає відповідей. Будьте першим, хто долучиться до обговорення.
                  </CardContent>
                </Card>
              )}

              {isAuthenticated ? (
                <Card className="mt-6 border-[#d9e2ec] bg-[#f8fafc]">
                  <CardContent className="p-5">
                    <h3 className="mb-3 font-semibold text-[#1e3a5f]">Ваша відповідь</h3>
                    <form onSubmit={handleReply} className="space-y-3">
                      <Textarea
                        value={replyText}
                        onChange={(event) => setReplyText(event.target.value)}
                        placeholder="Напишіть свою думку..."
                        maxLength={4000}
                        className="min-h-[120px] bg-white focus-visible:ring-[#e67e22]"
                        disabled={isReplying}
                      />
                      {replyError && <p className="text-sm text-red-600" role="alert">{replyError}</p>}
                      <div className="flex justify-end">
                        <Button type="submit" className="bg-[#e67e22] text-white hover:bg-[#d35400]" disabled={isReplying}>
                          {isReplying && <Loader2 className="h-4 w-4 animate-spin" />}
                          {isReplying ? 'Публікація...' : 'Додати відповідь'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <p className="mt-6 text-center text-gray-500">
                  <Link to="/login" className="font-medium text-[#e67e22] hover:underline">Увійдіть</Link>, щоб залишити відповідь.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
